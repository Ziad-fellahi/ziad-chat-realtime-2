const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const app = express();
const server = http.createServer(app);

// 1. Connexion au Redis local du serveur
const pubClient = createClient({ url: 'redis://127.0.0.1:6379' });
const subClient = pubClient.duplicate();

const io = new Server(server, {
  cors: {
    origin: "*", // Autorise tout pour le test, on restreindra après
    methods: ["GET", "POST"]
  }
});

async function run() {
  // Connexion Redis
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));
  console.log("✅ Redis est connecté et l'adaptateur est prêt.");

  io.on('connection', async (socket) => {
    console.log(`🔌 Nouveau client : ${socket.id}`);

    // Envoyer l'historique direct depuis Redis
    const history = await pubClient.lRange('chat_history', 0, 49);
    socket.emit('message_history', history.map(h => JSON.parse(h)).reverse());

    socket.on('msg_to_server', async (data) => {
      const msg = { ...data, id: Date.now() };
      
      // Stockage dans Redis
      await pubClient.lPush('chat_history', JSON.stringify(msg));
      await pubClient.lTrim('chat_history', 0, 49);

      // Diffusion
      io.emit('msg_to_client', msg);
    });
  });

  server.listen(5000, () => console.log('🚀 Serveur sur port 5000'));
}

run().catch(err => console.error("💥 Erreur:", err));