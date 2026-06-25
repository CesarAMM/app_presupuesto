import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import metadataRoutes from './routes/metadata.routes'
import coreUser from './routes/auth.routes'
import corePresupuesto from './routes/presupuesto.routes'
import { basicAuth } from './middlewares/basicAuth.middleware'

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/metadata', basicAuth, metadataRoutes);
app.use('/api/core', basicAuth, coreUser);
app.use('/api/presupuesto', basicAuth, corePresupuesto);

export default app;