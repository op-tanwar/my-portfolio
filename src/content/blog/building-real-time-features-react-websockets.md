---
title: "Building Real-Time Features in React with WebSockets"
description: "From live dashboards to collaborative editing — a production guide to WebSocket architecture, React integration, reconnection, and the pitfalls that break real-time UX."
publishDate: 2026-04-22
category: "React"
tags: ["React", "WebSockets", "Real-Time", "Architecture", "Next.js"]
featured: true
accent: "#f7df1e"
image: "../../assets/blog/building-real-time-features-react-websockets.jpg"
imageAlt: "Real-time data dashboard on multiple monitors"
---

The operations team at a logistics startup in Berlin needed a live shipment tracking dashboard. Dispatchers stared at a React page that refreshed every thirty seconds via polling. Drivers updated statuses from mobile. Dispatchers saw stale data, called drivers who had already delivered, and lost trust in the tool.

We replaced polling with WebSockets. Status updates appeared within 200 milliseconds. Support tickets about "wrong delivery status" dropped to near zero in the first month. The React frontend didn't change much visually. The architecture underneath changed completely.

Real-time features — live notifications, collaborative cursors, chat, dashboards, presence indicators — are increasingly common in client projects. They're also easy to build poorly. Memory leaks from uncleaned listeners, reconnection storms, state desync between server and client, and WebSocket connections that multiply on every React re-render have all cost me debugging hours.

This article covers the production patterns I use for WebSocket-powered React features: architecture choices, hook design, reconnection logic, and scaling considerations.

## WebSockets vs. Alternatives

Before reaching for WebSockets, I validate the requirement.

| Approach | Best For | Trade-offs |
|----------|----------|------------|
| **Polling** | Low-frequency updates, simple infra | Wasteful, latency = poll interval |
| **Long polling** | Legacy compatibility | Complex server-side, not truly real-time |
| **Server-Sent Events (SSE)** | Server → client only (notifications, feeds) | No bidirectional, HTTP/1.1 connection limits |
| **WebSockets** | Bidirectional, low-latency, high frequency | Infra complexity, connection management |
| **Third-party (Pusher, Ably, Supabase Realtime)** | Fast time-to-market, managed scaling | Cost, vendor dependency |

For the Berlin dashboard, updates flowed both ways: server pushed driver status changes, clients sent filter subscriptions. WebSockets were the right fit.

For a client's "new blog post" notification bell that only received events, SSE would have been simpler. I still chose WebSockets because they planned to add chat within six months. Architecture had to grow.

## Architecture Overview

Production real-time React apps typically look like:

```
React Client ←→ WebSocket Server ←→ Database / Message Queue
                     ↑
              Auth middleware
              Room/channel routing
              Event broadcasting
```

The WebSocket server is rarely inside the React app. It's a separate service or a dedicated route with a long-lived connection handler.

Options I've deployed:

1. **Dedicated Node.js WebSocket server** (ws library) on Railway/Fly.io
2. **Socket.io** with Redis adapter for multi-instance scaling
3. **Supabase Realtime** for Postgres-backed subscriptions
4. **Pusher/Ably** for client projects with budget and timeline pressure

For the Berlin project, we ran a Node.js `ws` server alongside the Next.js app, connected to PostgreSQL via LISTEN/NOTIFY for database change events.

## WebSocket Server: Minimal Production Setup

```ts
// ws-server/index.ts
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { verifyToken } from "./auth";

interface Client extends WebSocket {
  userId?: string;
  rooms: Set<string>;
  isAlive: boolean;
}

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: Client, req) => {
  ws.isAlive = true;
  ws.rooms = new Set();

  ws.on("pong", () => { ws.isAlive = true; });

  ws.on("message", async (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === "auth") {
        const user = await verifyToken(msg.token);
        if (!user) return ws.close(4001, "Unauthorized");
        ws.userId = user.id;
        ws.send(JSON.stringify({ type: "auth:ok" }));
        return;
      }

      if (msg.type === "subscribe" && ws.userId) {
        ws.rooms.add(msg.room);
        return;
      }

      if (msg.type === "unsubscribe") {
        ws.rooms.delete(msg.room);
        return;
      }
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
    }
  });

  ws.on("close", () => {
    ws.rooms.clear();
  });
});

// Heartbeat — detect dead connections
const interval = setInterval(() => {
  wss.clients.forEach((ws: Client) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// Broadcast helper
export function broadcast(room: string, event: object) {
  const payload = JSON.stringify(event);
  wss.clients.forEach((ws: Client) => {
    if (ws.readyState === WebSocket.OPEN && ws.rooms.has(room)) {
      ws.send(payload);
    }
  });
}

server.listen(3001);
```

Key production elements:

- **Authentication** before subscribing to rooms
- **Room-based routing** so clients only receive relevant events
- **Heartbeat/ping-pong** to detect dead connections
- **Structured message types** with JSON schema validation (Zod on both ends)

## React Hook: useWebSocket

The hook is where most React projects go wrong. One connection per app, not per component.

```tsx
// hooks/useWebSocket.ts
"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

type MessageHandler = (data: unknown) => void;
type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface WebSocketStore {
  status: ConnectionStatus;
  subscribe: (event: string, handler: MessageHandler) => () => void;
  send: (message: object) => void;
}

// Singleton connection manager
let ws: WebSocket | null = null;
let status: ConnectionStatus = "disconnected";
let reconnectAttempts = 0;
const listeners = new Map<string, Set<MessageHandler>>();
const statusListeners = new Set<() => void>();
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const MAX_RECONNECT_DELAY = 30000;
const BASE_RECONNECT_DELAY = 1000;

function getReconnectDelay() {
  return Math.min(BASE_RECONNECT_DELAY * 2 ** reconnectAttempts, MAX_RECONNECT_DELAY);
}

function setStatus(next: ConnectionStatus) {
  status = next;
  statusListeners.forEach((fn) => fn());
}

function connect(url: string, token: string) {
  if (ws?.readyState === WebSocket.OPEN) return;

  setStatus("connecting");
  ws = new WebSocket(url);

  ws.onopen = () => {
    reconnectAttempts = 0;
    setStatus("connected");
    ws!.send(JSON.stringify({ type: "auth", token }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const handlers = listeners.get(data.type);
      handlers?.forEach((handler) => handler(data));
    } catch {
      console.error("Failed to parse WebSocket message");
    }
  };

  ws.onclose = (event) => {
    setStatus("disconnected");
    ws = null;
    if (event.code !== 4001) scheduleReconnect(url, token);
  };

  ws.onerror = () => setStatus("error");
}

function scheduleReconnect(url: string, token: string) {
  if (reconnectTimer) return;
  const delay = getReconnectDelay();
  reconnectAttempts++;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect(url, token);
  }, delay);
}

function subscribe(event: string, handler: MessageHandler) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(handler);
  return () => listeners.get(event)?.delete(handler);
}

function send(message: object) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Provider component
export function WebSocketProvider({
  children,
  url,
  token,
}: {
  children: React.ReactNode;
  url: string;
  token: string;
}) {
  useEffect(() => {
    connect(url, token);
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
      ws = null;
    };
  }, [url, token]);

  return <>{children}</>;
}

export function useWebSocketStatus(): ConnectionStatus {
  return useSyncExternalStore(
    (cb) => { statusListeners.add(cb); return () => statusListeners.delete(cb); },
    () => status,
    () => "disconnected" as ConnectionStatus
  );
}

export function useWebSocketEvent<T>(event: string, handler: (data: T) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return subscribe(event, (data) => handlerRef.current(data as T));
  }, [event]);
}

export function useWebSocketSend() {
  return useCallback(send, []);
}
```

Design decisions:

- **Singleton connection** — one WebSocket per app, not per hook call
- **Event-based subscription** — components subscribe to message types
- **Exponential backoff** on reconnect with a cap
- **Auth on connect** with token from your session
- **`useSyncExternalStore`** for connection status without re-render storms

## Using the Hook in Components

```tsx
// components/ShipmentTracker.tsx
"use client";

import { useEffect, useState } from "react";
import { useWebSocketEvent, useWebSocketSend, useWebSocketStatus } from "@/hooks/useWebSocket";

interface ShipmentUpdate {
  type: "shipment:updated";
  shipmentId: string;
  status: string;
  location: { lat: number; lng: number };
  timestamp: string;
}

export function ShipmentTracker({ initialShipments }: { initialShipments: Shipment[] }) {
  const [shipments, setShipments] = useState(initialShipments);
  const send = useWebSocketSend();
  const status = useWebSocketStatus();

  useEffect(() => {
    send({ type: "subscribe", room: "shipments:all" });
    return () => send({ type: "unsubscribe", room: "shipments:all" });
  }, [send]);

  useWebSocketEvent<ShipmentUpdate>("shipment:updated", (data) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === data.shipmentId
          ? { ...s, status: data.status, location: data.location, updatedAt: data.timestamp }
          : s
      )
    );
  });

  return (
    <div>
      <ConnectionBadge status={status} />
      <ShipmentList shipments={shipments} />
    </div>
  );
}
```

Initial data comes from the server (Server Component or API). WebSocket updates merge into local state. Users see content immediately, then live updates layer on.

## State Management for Real-Time Data

Three patterns depending on complexity:

### Local State (Simple)

Single component, few event types. `useState` + `useWebSocketEvent`. Works for the Berlin dashboard's per-widget updates.

### Zustand Store (Medium)

Multiple components share real-time state:

```ts
// stores/shipmentStore.ts
import { create } from "zustand";

interface ShipmentStore {
  shipments: Map<string, Shipment>;
  setInitial: (shipments: Shipment[]) => void;
  updateShipment: (id: string, update: Partial<Shipment>) => void;
}

export const useShipmentStore = create<ShipmentStore>((set) => ({
  shipments: new Map(),
  setInitial: (shipments) =>
    set({ shipments: new Map(shipments.map((s) => [s.id, s])) }),
  updateShipment: (id, update) =>
    set((state) => {
      const next = new Map(state.shipments);
      const existing = next.get(id);
      if (existing) next.set(id, { ...existing, ...update });
      return { shipments: next };
    }),
}));
```

A single WebSocket listener in a provider updates the store. Components subscribe to slices.

### React Query + WebSocket Invalidation (Complex)

For data that also fetches via REST:

```tsx
useWebSocketEvent("shipment:updated", (data) => {
  queryClient.setQueryData(["shipment", data.shipmentId], (old) => ({
    ...old,
    ...data,
  }));
});
```

Optimistic updates via WebSocket, with React Query as source of truth for initial fetch and refetch on reconnect.

## Reconnection and State Recovery

Reconnecting isn't enough. Clients need current state after a disconnect, not just future events.

**Strategy 1: Full refetch on reconnect**

```tsx
useEffect(() => {
  if (status === "connected" && wasDisconnected.current) {
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
    wasDisconnected.current = false;
  }
  if (status === "disconnected") wasDisconnected.current = true;
}, [status]);
```

Simple, reliable. Slight flicker on reconnect.

**Strategy 2: Server sends snapshot on subscribe**

When a client subscribes to a room, server sends current state before streaming updates:

```ts
ws.on("message", (msg) => {
  if (msg.type === "subscribe") {
    const snapshot = getRoomSnapshot(msg.room);
    ws.send(JSON.stringify({ type: "snapshot", room: msg.room, data: snapshot }));
    ws.rooms.add(msg.room);
  }
});
```

Better UX for large datasets. More server logic.

**Strategy 3: Event sequence numbers**

Each event has a monotonic `seq` number. Client tracks last seen seq. On reconnect, requests events since `lastSeq`. Handles gaps without full refetch. I use this on high-frequency trading dashboards. Overkill for shipment tracking.

## Authentication and Security

WebSockets don't automatically send cookies on all platforms. Patterns:

**Token in first message** (shown above) — client sends JWT after connect. Server validates before accepting subscriptions.

**Token in query string** — `wss://api.example.com/ws?token=xxx`. Works but tokens appear in logs. Use short-lived tokens.

**Cookie-based** — works when WebSocket server shares origin with the app. Browser sends cookies automatically on same-origin connections.

Security checklist:

- Validate auth before room subscription
- Authorize room access server-side (user can only join rooms they own)
- Rate limit messages per connection
- Validate message schema with Zod
- Never trust client-sent data for privileged operations without server verification
- Use WSS (TLS) in production — always

## Scaling WebSockets

Single server handles thousands of connections. Beyond that:

**Sticky sessions** — load balancer routes same client to same instance. Fragile.

**Redis pub/sub adapter** (Socket.io pattern) — instances publish to Redis, all instances broadcast to their connected clients. This is what I deployed when the Berlin client expanded to three EU regions.

```ts
// Simplified Redis pub/sub between WS instances
import { Redis } from "ioredis";

const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);

sub.subscribe("shipments");
sub.on("message", (channel, message) => {
  broadcastLocal(channel, JSON.parse(message));
});

export function broadcastGlobal(room: string, event: object) {
  pub.publish(room, JSON.stringify(event));
}
```

**Managed services** — Pusher, Ably, Supabase Realtime handle scaling, presence, and history. For a US fintech client under time pressure, Ably cost $49/month and saved two weeks of infra work. Reasonable trade-off.

## Next.js Integration

Next.js API routes aren't designed for long-lived WebSocket connections. Options:

1. **Separate WebSocket server** (recommended for production)
2. **Custom server** wrapping Next.js (complicates deployment on Vercel)
3. **Edge-compatible alternatives** (Partykit, Cloudflare Durable Objects)

For Vercel-hosted Next.js apps, I always run the WebSocket server separately. Next.js handles HTTP. WebSocket server handles real-time. Shared auth via JWT.

```tsx
// app/layout.tsx
import { WebSocketProvider } from "@/hooks/useWebSocket";
import { getSession } from "@/lib/auth";

export default async function Layout({ children }) {
  const session = await getSession();
  return (
    <WebSocketProvider url={process.env.NEXT_PUBLIC_WS_URL!} token={session.accessToken}>
      {children}
    </WebSocketProvider>
  );
}
```

Token comes from server session. Client never stores long-lived credentials in localStorage.

## UI Patterns for Real-Time

Real-time data needs real-time UX conventions:

**Connection status indicator** — show when disconnected, disable actions that require live data.

**Optimistic updates** — update UI immediately, reconcile on server confirmation or rollback on error.

**Conflict resolution** — for collaborative editing, last-write-wins is simplest. CRDTs (Yjs, Automerge) for true collaboration. I integrated Yjs with WebSocket sync for a design agency's internal tool. Three weeks of work. Worth it for simultaneous editing. Overkill for a status dashboard.

**Debounced server updates** — don't send WebSocket message on every keystroke. Debounce 300ms for typing indicators, 1000ms for auto-save.

```tsx
const debouncedSend = useMemo(
  () => debounce((text: string) => send({ type: "typing", text }), 300),
  [send]
);
```

## Testing Real-Time Features

Real-time code is hard to test. My minimum bar:

**Unit tests** — message handlers, state reducers, reconnection delay calculation.

**Integration tests** — mock WebSocket with a test server (ws library in test process).

```ts
// __tests__/shipmentTracker.test.ts
import { WebSocketServer } from "ws";
import { render, waitFor } from "@testing-library/react";

let wss: WebSocketServer;

beforeAll(() => {
  wss = new WebSocketServer({ port: 9999 });
  wss.on("connection", (ws) => {
    ws.on("message", () => {
      ws.send(JSON.stringify({ type: "shipment:updated", shipmentId: "1", status: "delivered" }));
    });
  });
});

test("updates shipment on WebSocket event", async () => {
  render(<ShipmentTracker initialShipments={[{ id: "1", status: "in-transit" }]} />);
  await waitFor(() => expect(screen.getByText("delivered")).toBeInTheDocument());
});
```

**Manual QA checklist** — disconnect WiFi, reconnect, verify state. Open two tabs, verify both receive updates. Leave tab idle for 5 minutes, verify heartbeat keeps connection.

## Common Pitfalls

**New WebSocket per render** — the singleton pattern exists to prevent this.

**No cleanup on unmount** — unsubscribe from rooms, remove event listeners.

**Sending full state on every update** — send deltas. `{ shipmentId, status }` not the entire shipment object with nested relations.

**Ignoring backpressure** — if clients can't process messages fast enough, queue or drop with sequence numbers.

**No monitoring** — track connected clients, messages per second, reconnection rate, error rate. I use Prometheus metrics on the WS server.

## Conclusion

Real-time features transform reactive UIs into live ones. The Berlin logistics team didn't need a rewrite — they needed a persistent connection, room-based routing, and a React hook that didn't leak connections on every navigation.

WebSockets add infrastructure complexity. The payoff is UX that polling can't match. Start with clear event schemas, a singleton connection manager, reconnection with state recovery, and security at the subscription layer. Reach for managed services when timeline beats control.

Build the boring parts right — auth, reconnect, cleanup — and the exciting parts (live dashboards, instant notifications) actually work in production.


Need live updates without turning the whole app into a reconnecting mess? [Hire a React developer](/hire-react-developer) experienced with WebSocket clients, auth, and recovery UX.

## Key Takeaways

- Choose WebSockets for bidirectional, low-latency updates; consider SSE for server-to-client-only feeds
- Run WebSocket servers separately from Next.js API routes — Vercel and serverless aren't built for persistent connections
- Use a singleton connection per app with event-based subscriptions, not one WebSocket per component
- Authenticate before room subscription and authorize room access server-side
- Implement exponential backoff reconnection and state recovery (refetch or snapshot) after disconnects
- Send delta updates, not full objects, and validate message schemas on both ends
- Scale with Redis pub/sub between instances or managed services (Pusher, Ably, Supabase) when connection count grows
- Show connection status in the UI and test disconnect/reconnect scenarios manually
