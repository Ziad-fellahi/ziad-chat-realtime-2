const { io } = require("socket.io-client");

const socket = io("https://stage.govo.fr", {
  transports: ["websocket"],
  withCredentials: true
});

let lastNumber = 0;
let missingCount = 0;
let totalReceived = 0;

console.log("🚀 Lancement du diagnostic de flux...");

socket.on("msg_to_client", (data) => {
  totalReceived++;
  const currentNumber = parseInt(data.text);

  // Vérification de la séquence
  if (currentNumber !== lastNumber + 1) {
    if (currentNumber > lastNumber + 1) {
      const gap = currentNumber - (lastNumber + 1);
      missingCount += gap;
      console.log(`⚠️ TROU DÉTECTÉ : ${gap} message(s) manquant(s) entre ${lastNumber} et ${currentNumber}`);
    } else if (currentNumber <= lastNumber) {
      console.log(`🔄 DÉSORDRE : Reçu ${currentNumber} après ${lastNumber} (Instance PM2 différente ?)`);
    }
  }

  lastNumber = currentNumber;

  // Affichage du statut tous les 50 messages pour ne pas saturer la console
  if (totalReceived % 50 === 0) {
    console.log(`📊 Statut : ${totalReceived} reçus | ${missingCount} manquants | Dernier : ${lastNumber}`);
  }
});

socket.on("connect", () => console.log("✅ Connecté au serveur !"));
socket.on("connect_error", (err) => console.error("❌ Erreur:", err.message));