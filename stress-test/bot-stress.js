const { io } = require("socket.io-client");

const NUM_BOTS = 500;
const URL = "https://stage.govo.fr";
let globalCounter = 1;
const bots = [];

console.log(`⏳ Initialisation des ${NUM_BOTS} bots...`);

// 1. Connexion silencieuse des bots
for (let i = 1; i <= NUM_BOTS; i++) {
  const socket = io(URL, { 
    transports: ["websocket"],
    withCredentials: true 
  });
  bots.push({ id: i, socket });
}

// 2. On attend 3 secondes que toutes les connexions soient stables
setTimeout(() => {
  console.log("🚀 Lancement du flux (1 message / seconde)");
  console.log("Regarde ton dashboard React maintenant !");

  // 3. Cadenceur fixe à 1000ms
  setInterval(() => {
    // Sélection du bot (1, puis 2, puis 3...)
    const botIndex = (globalCounter - 1) % NUM_BOTS;
    const activeBot = bots[botIndex];

    activeBot.socket.emit("msg_to_server", {
      user: `Bot-${activeBot.id}`,
      text: `${globalCounter}`
    });

    // Log console sur ton PC pour vérifier l'envoi
    console.log(`[SEND] Bot-${activeBot.id} envoie le numéro : ${globalCounter}`);
    
    globalCounter++;
  }, 10); //   seconde entre chaque message

}, 3000);