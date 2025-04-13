// const canvas = document.getElementById("battleCanvas");
// const ctx = canvas.getContext("2d");

// const player = {
//   x: 190,
//   y: 90,
//   size: 10,
//   speed: 2,
// };

// function drawHeart(x, y) {
//   ctx.fillStyle = "red";
//   ctx.beginPath();
//   ctx.moveTo(x, y);
//   ctx.bezierCurveTo(x, y - 5, x - 10, y - 15, x - 10, y);
//   ctx.bezierCurveTo(x - 10, y + 10, x, y + 15, x, y + 20);
//   ctx.bezierCurveTo(x, y + 15, x + 10, y + 10, x + 10, y);
//   ctx.bezierCurveTo(x + 10, y - 15, x, y - 5, x, y);
//   ctx.fill();
// }

// const keys = {};

// document.addEventListener("keydown", (e) => {
//   keys[e.key] = true;
// });

// document.addEventListener("keyup", (e) => {
//   keys[e.key] = false;
// });

// function update() {
//   if (keys["ArrowLeft"]) player.x -= player.speed;
//   if (keys["ArrowRight"]) player.x += player.speed;
//   if (keys["ArrowUp"]) player.y -= player.speed;
//   if (keys["ArrowDown"]) player.y += player.speed;

//   // límites
//   player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
//   player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
// }

// function draw() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   drawHeart(player.x, player.y);
// }

// function loop() {
//   update();
//   draw();
//   requestAnimationFrame(loop);
// }

// loop();



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

function perdonarZorua() {
    document.getElementById("mensajeZorua").textContent = "Has decidido perdonar a Zorua.";
}






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





//* Perdonacion

function perdonarZorua() {
    const zorua = document.getElementById("imgZorua");
    const fondo = document.getElementById("fondoOscuro");
    const zonaBatalla = document.getElementById("zonaBatalla");
    const barraWena = document.getElementById("barraWena");
    const JefeUZ = document.getElementById("JefeUZ");


    // Mostrar mensaje de paz
    document.getElementById("mensajeZorua").textContent = "Has decidido perdonar a Zorua!!!.";

    // Cambiar apariencia a oscura
    zorua.style.filter = "brightness(0.5) grayscale(0.8)";
    zorua.style.animation = "none"; // detener animación si está por CSS
    clearInterval(moverIntervalo);

    // Asegúrate que `moverIntervalo` sea accesible desde aquí
    JefeUZ.pause();


    // Opcional: Puedes hacer una animación suave de desvanecimiento
    setTimeout(() => {
        fondo?.classList.add("desaparecer-suave");
        zonaBatalla?.classList.add("desaparecer-suave");
        barraWena?.classList.add("desaparecer-suave");
    }, 3000);
}



