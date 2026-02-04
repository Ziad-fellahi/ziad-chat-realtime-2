const express = require('express');
const http = require('http');
const cors = require('cors'); 
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning");
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// --- 2. CONFIGURATION REDIS ---
const pubClient = createClient({ url: 'redis://127.0.0.1:6379' });
const subClient = pubClient.duplicate();

// --- 3. CONFIGURATION SOCKET.IO ---
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["ngrok-skip-browser-warning"]
  }
});

// --- 4. ROUTES API (Auth) ---

app.get('/', (req, res) => {
  res.send("🚀 Backend GovoStage en ligne !");
});

app.post('/auth/login', (req, res) => {
  console.log("🔑 Login reçu pour:", req.body.username);
  
  // Création d'un token structuré pour éviter l'erreur de décodage Navbar
  const userPayload = { 
    username: req.body.username || "Anonyme", 
    role: "admin" 
  };
  const encodedPayload = Buffer.from(JSON.stringify(userPayload)).toString('base64');
  
  // Format JWT : header.payload.signature
  const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.signature_artisanale`;

  res.json({ 
    success: true, 
    message: "Connexion réussie",
    token: fakeToken 
  });
});

app.post('/auth/register', (req, res) => {
  console.log("📝 Inscription reçue:", req.body);
  res.json({ success: true, message: "Utilisateur enregistré !" });
});

// --- 5. LOGIQUE SOCKET & REDIS ---

async function run() {
  await pubClient.connect();
  await subClient.connect();
  
  io.adapter(createAdapter(pubClient, subClient));
  console.log("✅ Redis connecté.");

  io.on('connection', async (socket) => {
    console.log(`🔌 Client connecté : ${socket.id}`);

    const history = await pubClient.lRange('chat_history', 0, 49);
    socket.emit('message_history', history.map(h => JSON.parse(h)).reverse());

    socket.on('msg_to_server', async (data) => {
      const msg = { ...data, id: Date.now() };
      await pubClient.lPush('chat_history', JSON.stringify(msg));
      await pubClient.lTrim('chat_history', 0, 49);
      io.emit('msg_to_client', msg);
    });
  });

  server.listen(8080, () => {
    console.log('🚀 SERVEUR SUR PORT 8080');
  });
}

run().catch(err => console.error("💥 Erreur:", err));