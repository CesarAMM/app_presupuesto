import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import metadataRoutes from './routes/metadata.routes'

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/metadata', metadataRoutes);

export default app;