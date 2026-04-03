import express from 'express';
import routes from './routes.js';
import { connectDB } from './config/db.js';
import cors from 'cors';

const app = express();

app.use(cors());
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

export default app;