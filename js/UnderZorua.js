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
let posicionZorua = 50; // Empezamos en el centro (50%)
let direccion = 1; // 1 = derecha, -1 = izquierda

function moverZorua() {
    // Cambiar la posición de Zorua
    posicionZorua += direccion * 2; // Cambia 2 a la velocidad deseada

    // Cambiar la dirección si llega a los bordes
    if (posicionZorua >= 60 || posicionZorua <= 40) {
        direccion *= -1; // Cambiar dirección
    }

    imgZorua.style.left = `${posicionZorua}%`; // Aplicar nueva posición
}

// Llamar a moverZorua cada 50ms (ajusta para velocidad)
setInterval(moverZorua, 50);


document.getElementById("btnAtacar").addEventListener("click", () => {
    // Lógica para atacar a Zorua
    atacarZorua();
});

document.getElementById("btnActuar").addEventListener("click", () => {
    // Lógica para actuar (ejemplo: intentar huir, hacer un movimiento especial, etc.)
    actuarContraZorua();
});

document.getElementById("btnObjeto").addEventListener("click", () => {
    // Lógica para usar un objeto
    usarObjeto();
});

document.getElementById("btnPerdonar").addEventListener("click", () => {
    // Lógica para perdonar a Zorua
    perdonarZorua();
});


function atacarZorua() {
    const hpZorua = 100; // Cambiar a una variable global si lo necesitas
    // Simulamos un ataque
    const dano = 10; // Ejemplo de daño
    hpZorua -= dano; // Restamos el daño
    document.getElementById("mensajeZorua").textContent = `¡Zorua recibe ${dano} de daño!`;
    // Actualiza la lógica de vida de Zorua, animaciones, etc.
}

function actuarContraZorua() {
    document.getElementById("mensajeZorua").textContent = "¡Zorua se burla de tu intento!";
}

function usarObjeto() {
    document.getElementById("mensajeZorua").textContent = "No tienes objetos para usar.";
}

function perdonarZorua() {
    document.getElementById("mensajeZorua").textContent = "Has decidido perdonar a Zorua.";
}


