# Express TypeScript API with Socket.IO

A simple backend built with **Express**, **TypeScript**, and **Socket.IO** that simulates a transaction session with real-time updates. Includes Docker support.

---

## Features

- `POST /session`: Creates a new session and returns a session ID.
- `GET /session/:id`: Returns the status of a session.
- Real-time updates via **Socket.IO**
- Simulated status flow: `payment_initiated` → `processing` → `success` or `failure`
- CORS enabled for frontend integration

---

## Installation

```bash
git clone https://github.com/your-username/payment-widget-api.git
cd payment-widget-api
npm install
```
## start locally
```bash
npm run dev
```

## Or Docker build
```bash
docker build -t express-ts-app .
docker run -p 3000:3000 express-ts-app
```