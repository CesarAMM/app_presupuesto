import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import metadataRoutes from './routes/metadata.routes'
import { basicAuth } from './middlewares/basicAuth.middleware'

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/metadata', basicAuth, metadataRoutes);

export default app;