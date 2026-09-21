import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { connectMongo } from './db/mongo';
import {
  CandidateModel,
  CompanyModel,
  EvaluatorModel,
  RequirementModel,
  EvaluationModel,
  ShortlistModel,
  PlacementModel,
  AuditLogModel,
} from './db/models';

import { authRouter } from './routes/auth';
import { companiesRouter } from './routes/companies';
import { candidatesRouter } from './routes/candidates';
import { evaluatorsRouter } from './routes/evaluators';
import { requirementsRouter } from './routes/requirements';
import { evaluationsRouter } from './routes/evaluations';
import { shortlistsRouter } from './routes/shortlists';
import { interviewsRouter } from './routes/interviews';
import { offersRouter } from './routes/offers';
import { placementsRouter } from './routes/placements';
import { financeRouter } from './routes/finance';
import { adminRouter } from './routes/admin';
import { companyPortalRouter } from './routes/companyPortal';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Real-time Socket.IO Server
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_room', (room: string) => {
    socket.join(room);
    console.log(`[Socket.IO] Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/evaluators', evaluatorsRouter);
app.use('/api/requirements', requirementsRouter);
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/shortlists', shortlistsRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/placements', placementsRouter);
app.use('/api/finance', financeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/company', companyPortalRouter);

// Audit logs
app.get('/api/audit', async (req, res) => {
  try {
    const { limit = '50' } = req.query;
    const l = Math.max(1, parseInt(String(limit), 10) || 50);
    const [total, logs] = await Promise.all([
      AuditLogModel.countDocuments(),
      AuditLogModel.find().sort({ timestamp: -1 }).limit(l).lean(),
    ]);

    return res.json({
      success: true,
      data: logs,
      total,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Notifications
app.get('/api/notifications', async (_req, res) => {
  try {
    const recentLogs = await AuditLogModel.find().sort({ timestamp: -1 }).limit(5).lean();
    const notifs = recentLogs.map((log: any, idx: number) => ({
      id: log.id || `notif-${idx}`,
      title: (log.action || 'HIRING_UPDATE').replace(/_/g, ' '),
      message: log.details?.reason || (typeof log.details === 'string' ? log.details : `${log.entity || 'Activity'} updated by ${log.actorEmail || 'System'}`),
      type: log.action?.includes('ERROR') ? 'ERROR' : log.action?.includes('APPROVED') ? 'SUCCESS' : 'INFO',
      createdAt: log.timestamp || new Date().toISOString(),
    }));

    return res.json({
      success: true,
      data: notifs.length > 0 ? notifs : [
        {
          id: 'notif-1',
          title: 'Pipeline Active',
          message: 'Hiring requirements and candidate matching active in MongoDB Atlas.',
          type: 'INFO',
          createdAt: new Date().toISOString(),
        }
      ],
      total: notifs.length,
    });
  } catch (err: any) {
    return res.json({ success: true, data: [], total: 0 });
  }
});

// Health check with live MongoDB Atlas counts
app.get('/api/health', async (_req, res) => {
  try {
    const [
      candidates,
      companies,
      evaluators,
      requirements,
      evaluations,
      shortlists,
      placements,
    ] = await Promise.all([
      CandidateModel.countDocuments(),
      CompanyModel.countDocuments(),
      EvaluatorModel.countDocuments(),
      RequirementModel.countDocuments(),
      EvaluationModel.countDocuments(),
      ShortlistModel.countDocuments(),
      PlacementModel.countDocuments(),
    ]);

    return res.json({
      status: 'HEALTHY',
      service: 'Thamilarasan Global Central API (MongoDB Atlas Dynamic)',
      database: 'MongoDB Atlas (anthurium cluster0)',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      metrics: {
        candidates,
        companies,
        evaluators,
        requirements,
        evaluations,
        shortlists,
        placements,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // 1. Connect to live MongoDB Atlas
  await connectMongo();

  // 2. Start Express & Socket.IO HTTP server
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` THAMILARASAN GLOBAL - CENTRAL API`);
    console.log(` Database: 100% Dynamic MongoDB Atlas`);
    console.log(` Core positioning: Find. Evaluate. Hire.`);
    console.log(` Listening on: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap failure:', err);
});

export { app, server, io };
