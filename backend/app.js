import express from 'express';
import userrouter from './src/routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import projectrouter from './src/routes/project.routes.js';
import airouter from './src/routes/ai.routes.js';
import path from 'path';
import fs from 'fs';
const app = express();
app.use(cookieParser())
app.use(cors({
  origin: 'https://frontend-3hgp.onrender.com',
  credentials: true
}));
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      req.rawBody = buf && buf.toString(encoding || 'utf8');
    } catch (e) {
      req.rawBody = undefined;
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userrouter);
app.use("/api/project", projectrouter);
app.use("/api/ai", airouter);

// Serve HLS files from /hls and set proper content types for playlists and TS segments
app.use('/hls', express.static(path.join(process.cwd(), 'hls'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.m3u8')) res.type('application/vnd.apple.mpegurl');
    if (filePath.endsWith('.ts')) res.type('video/MP2T');
  }
}));

// List available playlists in backend/hls
app.get('/api/hls/list', async (req, res) => {
  const dir = path.join(process.cwd(), 'hls');
  try {
    const files = await fs.promises.readdir(dir);
    const playlists = files.filter(f => f.endsWith('.m3u8'));
    return res.json({ playlists });
  } catch (err) {
    return res.status(200).json({ playlists: [] });
  }
});

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    console.error('Invalid JSON payload for', req.method, req.path);
    console.error('Raw body (first 400 chars):', (req.rawBody || '').slice(0, 400));
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  next(err);
});



export default app;