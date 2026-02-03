const express = require('express');
const http = require('http');
const cors = require('cors'); // <--- AJOUTÉ
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const app = express();

// --- CONFIGURATION EXPRESS / CORS ---
app.use(cors({ origin: "*" })); // Autorise les requêtes de Vercel
app.use(express.json()); // Permet de lire les données JSON envoyées au login

const server = http.createServer(app);

// 1. Connexion au Redis local du serveur
const pubClient = createClient({ url: 'redis://127.0.0.1:6379' });
const subClient = pubClient.duplicate();

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// --- ROUTES EXPRESS (Pour corriger le bug de Vercel) ---

app.get('/', (req, res) => {
  res.send("🚀 Backend GovoStage opérationnel avec Redis !");
});

// Ta route de login que Vercel essaie d'appeler
app.post('/auth/login', (req, res) => {
  console.log("🔑 Tentative de login reçue:", req.body);
  // Ici tu mets ta logique de login. Pour le test on répond OK :
  res.json({ success: true, user: req.body.username || "User" });
});

async function run() {
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));
  console.log("✅ Redis est connecté et l'adaptateur est prêt.");

  io.on('connection', async (socket) => {
    console.log(`🔌 Nouveau client : ${socket.id}`);

    const history = await pubClient.lRange('chat_history', 0, 49);
    socket.emit('message_history', history.map(h => JSON.parse(h)).reverse());

    socket.on('msg_to_server', async (data) => {
      const msg = { ...data, id: Date.now() };
      await pubClient.lPush('chat_history', JSON.stringify(msg));
      await pubClient.lTrim('chat_history', 0, 49);
      io.emit('msg_to_client', msg);
    });
  });

  server.listen(5000, () => console.log('🚀 Serveur sur port 5000'));
}

run().catch(err => console.error("💥 Erreur:", err));