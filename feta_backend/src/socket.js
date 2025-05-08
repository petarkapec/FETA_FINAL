// socket.js
let io;

module.exports = {
  init: (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
      cors: {
        origin: '*', // prilagodi po potrebi
        methods: ['GET', 'POST'],
      },
    });

    io.on("connection", (socket) => {
      console.log("Socket povezan:", socket.id);
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io nije inicijaliziran!");
    }
    return io;
  },
};
