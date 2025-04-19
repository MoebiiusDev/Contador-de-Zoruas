const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");

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

            // Redibujar texto durante la transición
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
    cambiarTamanoCanvas(700, 700, iniciarPeleaUndertale); // Cambia el tamaño y activa la pelea
}

// Función de pelea estilo Undertale
function iniciarPeleaUndertale() {
    const player = {
        x: 350,
        y: 350,
        size: 10,
        speed: 2,
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

        player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
        player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibuja el cuadro
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

        drawHeart(player.x, player.y);
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }
    loop();
}