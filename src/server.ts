import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { errorHandler, handle404Error } from "./utils/errors";
import routes from './routes/routes';


const app = express();
const PORT = process.env.SERVER_PORT;

dotenv.config();
app.use(express.json());
app.use(cors());

const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs/access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (_req, res) => {
    res.json({
        message: 'SmartHome Server API.',
    });
});

app.get('/healthcheck', (_req, res) => {
    res.json({
        message: 'Server is running',
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});

app.use('/', routes);
app.all('*', handle404Error);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
