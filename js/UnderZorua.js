
const imgZorua = document.getElementById("imgZorua");
let posicionZorua = 50;
let direccion = 1;

function moverZorua() {
    posicionZorua += direccion * 0.2;

    if (posicionZorua >= 55 || posicionZorua <= 50) {
        direccion *= -1;
    }

    imgZorua.style.left = `${posicionZorua}%`;
}

// 🔧 ¡Ahora guardamos el intervalo para poder detenerlo!
let moverIntervalo = setInterval(moverZorua, 50);




// function atacarZorua() {
//     const hpZorua = 100; // Cambiar a una variable global si lo necesitas
//     // Simulamos un ataque
//     const dano = 10; // Ejemplo de daño
//     hpZorua -= dano; // Restamos el daño
//     document.getElementById("mensajeZorua").textContent = `¡Zorua recibe ${dano} de daño!`;
//     // Actualiza la lógica de vida de Zorua, animaciones, etc.
// }

function actuarContraZorua() {
    document.getElementById("mensajeZorua").textContent = "¡Zorua se burla de tu intento!";
}

function usarObjeto() {
    document.getElementById("mensajeZorua").textContent = "No tienes objetos para usar.";
}

// function perdonarZorua() {
//     document.getElementById("mensajeZorua").textContent = "Has decidido perdonar a Zorua.";
// }






const botones = document.querySelectorAll(".containerAtaque");
let indiceSeleccionado = 0;
// Marcar el botón seleccionado por defecto
botones[indiceSeleccionado].classList.add("seleccionado");
const sonidoSeleccion = new Audio("/sound/duck.mp3");
function reproducirSonidoSeleccion() {
    sonidoSeleccion.currentTime = 0; // Reinicia por si se reproduce rápido seguido
    sonidoSeleccion.play();
}



document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        cambiarSeleccion(1);
    } else if (e.key === "ArrowLeft") {
        cambiarSeleccion(-1);
    } else if (e.key === "Enter") {
        ejecutarAccion(botones[indiceSeleccionado]);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Selección inicial
    botones[indiceSeleccionado].classList.add("seleccionado");

    const imgInicial = botones[indiceSeleccionado].querySelector(".imgAtaque");
    if (imgInicial) imgInicial.src = "img/UndertaleEvent/Corazon.png";
    // reproducirSonidoSeleccion();
});

//* Cambia las imagenes del corazon
function cambiarSeleccion(direccion) {
    // Quitar imagen de corazón y estilo al botón anterior
    const imgAnterior = botones[indiceSeleccionado].querySelector(".imgAtaque");
    if (imgAnterior) imgAnterior.src = "/img/logo.png"; // Imagen original
    botones[indiceSeleccionado].classList.remove("seleccionado");

    // Cambiar índice
    indiceSeleccionado = (indiceSeleccionado + direccion + botones.length) % botones.length;

    // Añadir clase y cambiar a corazón
    botones[indiceSeleccionado].classList.add("seleccionado");
    const imgNueva = botones[indiceSeleccionado].querySelector(".imgAtaque");
    if (imgNueva) imgNueva.src = "/img/UndertaleEvent/Corazon.png"; // Imagen de corazón
    reproducirSonidoSeleccion();
}


function ejecutarAccion(boton) {
    const texto = boton.innerText.trim();
    switch (texto) {
        case "FIGHT":
            atacarZorua();
            break;
        case "ACT":
            actuarContraZorua();
            break;
        case "ITEM":
            usarObjeto();
            break;
        case "HOLA":
            perdonarZorua(); // Asumiendo que HOLA es para perdonar
            break;
        default:
            console.log("Acción no reconocida:", texto);
    }
}



//! Atacación!!!

function atacarZorua() {
    mostrarTextoDialogo("¡MEGAZORUA te lanza un ataque!");

    setTimeout(() => {
        iniciarPeleaUndertale();
    }, 1000); // 1 segundo de pausa
}


//!! CANVAS
const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");

// Mostrar mensaje inicial
function mostrarTextoAnimado(texto, index = 0) {
    // Borra el lienzo para evitar superposición
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Estilo del texto
    ctx.fillStyle = "#fff"; // Color blanco
    ctx.font = "16px 'Courier New'";

    // Dibujar texto progresivo
    ctx.fillText(`* ${texto.slice(0, index + 1)}`, 30, 60);

    // Continuar animación si no se ha terminado
    if (index < texto.length) {
        setTimeout(() => mostrarTextoAnimado(texto, index + 1), 50);
    }
}
mostrarTextoAnimado("MEGAZORUA está preparándose para pelear");

// Función para cambiar el tamaño del canvas de manera progresiva
function cambiarTamanoCanvas(anchoFinal, altoFinal, callback) {
    const duracion = 500; // Duración de la transición en milisegundos
    const pasos = 60; // Número de frames (FPS)
    const anchoInicial = canvas.width;
    const altoInicial = canvas.height;
    const cambioAncho = (anchoFinal - anchoInicial) / pasos;
    const cambioAlto = (altoFinal - altoInicial) / pasos;

    let pasoActual = 0;

    function animar() {
        if (pasoActual < pasos) {
            canvas.width = anchoInicial + cambioAncho * pasoActual;
            canvas.height = altoInicial + cambioAlto * pasoActual;

            // Redibujar cuadro durante la transición
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "16px 'Courier New'";
            ctx.fillText("* Cambiando el tamaño del cuadro...", 30, 60);

            pasoActual++;
            requestAnimationFrame(animar);
        } else if (callback) {
            // Llamar a la función de pelea después de la transición
            callback();
        }
    }
    animar();
}

// Evento al apretar FIGHT
function atacarZorua() {
    // Reducimos el tamaño del canvas al cuadro de 180 x 180
    cambiarTamanoCanvas(180, 180, iniciarPeleaUndertale); // Canvas ajustado
}

// Función de pelea estilo Undertale
function iniciarPeleaUndertale() {
    const player = {
        x: 95,
        y: 90,
        size: 10,
        speed: 5,
    };

    const keys = {};
    document.addEventListener("keydown", (e) => {
        keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });

    function drawHeart(x, y) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x, y - 5, x - 10, y - 15, x - 10, y);
        ctx.bezierCurveTo(x - 10, y + 10, x, y + 15, x, y + 20);
        ctx.bezierCurveTo(x, y + 15, x + 10, y + 10, x + 10, y);
        ctx.bezierCurveTo(x + 10, y - 15, x, y - 5, x, y);
        ctx.fill();
    }

    function update() {
        if (keys["ArrowLeft"]) player.x -= player.speed;
        if (keys["ArrowRight"]) player.x += player.speed;
        if (keys["ArrowUp"]) player.y -= player.speed;
        if (keys["ArrowDown"]) player.y += player.speed;

        // Limitar movimiento del corazón dentro de los 180 x 180
        player.x = Math.max(12, Math.min(187 - player.size, player.x));
        player.y = Math.max(10, Math.min(170 - player.size, player.y));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibuja el cuadro estilo Undertale
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 0, 0);

        drawHeart(player.x, player.y);
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }
    loop();
}


//* Perdonacion
function perdonarZorua() {
    const zorua = document.getElementById("imgZorua");
    const fondo = document.getElementById("fondoOscuro");
    const zonaBatalla = document.getElementById("zonaBatalla");
    const barraWena = document.getElementById("barraWena");
    const JefeUZ = document.getElementById("JefeUZ");

    // Detener animaciones y cambiar apariencia
    zorua.style.filter = "brightness(0.5) grayscale(0.8)";
    zorua.style.animation = "none"; // detener animación si está por CSS
    clearInterval(moverIntervalo); // Asegúrate de que esta variable sea accesible
    JefeUZ.pause();

    // Mostrar mensaje de perdón en el canvas principal
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    ctx.fillStyle = "#fff"; // Color blanco para el texto
    ctx.font = "16px 'Courier New'"; // Fuente estilo Undertale
    ctx.fillText("*Has decidido perdonar a Zorua!!!", 0, canvas.height / 2); // Mensaje centrado verticalmente

    // Opcional: Puedes hacer una animación suave de desvanecimiento del fondo y otros elementos
    setTimeout(() => {
        fondo?.classList.add("desaparecer-suave");
        zonaBatalla?.classList.add("desaparecer-suave");
        barraWena?.classList.add("desaparecer-suave");
    }, 3000);
}



