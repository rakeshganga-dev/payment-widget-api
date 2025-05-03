import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  status: string;
}

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const sessions: Map<string, Session> = new Map();

// POST /session
app.post('/session', (req: Request, res: Response) => {
  const sessionId: string = uuidv4();
  const status = 'payment_initiated';
  sessions.set(sessionId, { status });

  console.log(`[HTTP] New session created: ${sessionId}`);

  io.emit('sessionCreated', { sessionId, status });

  res.json({ sessionId, status });
});

// GET /session/:id
app.get('/session/:id', (req: Request, res: Response) => {
  const session:any = sessions.get(req.params.id);

  if (!session) {
    console.warn(`[HTTP] Session not found: ${req.params.id}`);
    res.status(404).json({ error: 'Session not found' });
  }

  console.log(`[HTTP] Retrieved status for session ${req.params.id}: ${session.status}`);
  res.json({ sessionId: req.params.id, status: session.status });
});

// Simulate status update
setInterval(() => {
  sessions.forEach((session, id) => {
    if (session.status === 'payment_initiated') {
        session.status = 'processing';
        console.log(`[SIMULATION] Session ${id} marked as processing`);
        io.emit('statusUpdated', { sessionId: id, status: session.status });
    }else if (session.status === 'processing') {
        const isSuccess = Math.random() < 0.5;
        session.status = isSuccess ? 'success' : 'failure';
      console.log(`[SIMULATION] Session ${id} marked as ${session.status }`);
      io.emit('statusUpdated', { sessionId: id, status: session.status });
    }
  });
}, 10000);

// Socket.IO
io.on('connection', (socket) => {
  console.log(`[SOCKET] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[SOCKET] Client disconnected: ${socket.id}`);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
