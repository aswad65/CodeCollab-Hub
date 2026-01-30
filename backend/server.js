import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import connectDB from './src/database/db.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import { ProjectModel } from './src/models/project.model.js';
import { AI_PROMPT } from './src/services/ai.service.js';

const PORT = 5000;

const server = http.createServer(app);
export const io = new Server(server,
  {
    cors: {
      origin: "*"
    }
  }
);
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization ? socket.handshake.headers.authorization.split(' ')[1] : undefined);
    const projectId = socket.handshake?.query?.projectId;


    // if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    //         throw new Error('Invalid projectId');
    //     }



    if (!token || token === 'null' || token === 'undefined' || typeof token !== 'string' || token.split('.').length !== 3) {
      return next(new Error("Unauthorized user"));
    }

    socket.project = await ProjectModel.findById(projectId);

    if (!socket.project) {
      return next(new Error("Project not found"));
    }



    let decoded = jwt.verify(token, process.env.Jwt_secret);

    if (!decoded) {
      throw new Error("Unauthorized user")

    }

    socket.users = decoded;
    next();
  } catch (err) {
    next(err);
  }
});
io.on("connection", socket => {
  socket.roomId = socket.project._id.toString()

  console.log("A user connected", socket.roomId);
  socket.join(socket.roomId);
  socket.on('project-message', async(data) => {
    const message = data.message;
    const aiinttegrattion = message.includes("@ai");
    if (aiinttegrattion) {
      const prompt = message.replace("@ai", "").trim();
      const result = await AI_PROMPT(prompt)
      io.to(socket.roomId).emit('project-message', { sender:{email:"AI",Id:"aI"}, message:result});
      return;
    }
    socket.broadcast.to(socket.roomId).emit('project-message', data);
    console.log(data);

  });


})

const startServer = async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message)
  }
}

startServer()

export default server;
