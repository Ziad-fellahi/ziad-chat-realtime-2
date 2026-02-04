const axios = require('axios');

const API_URL = "https://stage.govo.fr"; 
const NB_USERS = 5;      // On descend à 5 bots simultanés
const MSG_PAR_USER = 100; // Mais ils envoient plus de messages

async function lancerSimulation(id) {
    const user = `bot_test_${id}`;
    console.log(`👤 ${user} démarre...`);

    for (let i = 1; i <= MSG_PAR_USER; i++) {
        try {
            // Dans ton axios.post, change le timeout :
await axios.post(`${API_URL}/chat/messages`, {
    user: user,
    text: `Test message`
}, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    timeout: 10000 // <--- On passe à 10 secondes
});
            
            // On attend 1 seconde entre chaque message
            await new Promise(r => setTimeout(r, 1000)); 
        } catch (e) {
            console.error(`❌ Erreur pour ${user}: ${e.message}`);
        }
    }
    console.log(`✅ ${user} a terminé.`);
}

async function start() {
    console.log("🚀 LANCEMENT DU TEST STABLE (5 Bots / 1 msg par sec)");
    for (let i = 1; i <= NB_USERS; i++) {
        lancerSimulation(i);
        // On attend 2 secondes avant de lancer le bot suivant
        await new Promise(r => setTimeout(r, 2000));
    }
}

start();
