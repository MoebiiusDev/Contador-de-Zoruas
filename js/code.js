const frasesBoss = [
    "¡No puedes vencerme!",
    "Esa fue una pérdida de tiempo...",
    "¡Más rápido, humano!",
    "¿Eso fue un golpe? Patético.",
    "No estás ni cerca...",
    "¡Vamos! ¡Demuestra tu poder!",
];

const frasesDerrota = [
    "¿Eso fue todo? Patético.",
    "Vuelve cuando estés listo... si es que sobrevives.",
    "Jajaja... ni siquiera estuviste cerca.",
    "Qué decepción... esperaba más de ti.",
    "¿En serio pensaste que ganarías?"
];

let contador = 0;
let autoSumando = false;
let eventoActivo = false;
let eventoZoruaMostrado = false;
let incremento = 1;
let zoruaAyudando = false;
let zoruaFinalBossAparecio = false;
let ayudaUsada = false;
let intervaloLEs;

let barrettaDesbloqueada = false;
let entidadDesbloqueada = false;
let lesDesbloqueado = false;

let timeoutMostrar, timeoutOcultar;


const contadorElemento = document.getElementById('contador');
const boton = document.getElementById('aumentar');
const eventoZorua = document.getElementById('evento-zorua');
const mensaje = document.getElementById('mensaje');
const sonidoAyuda = document.getElementById('sonido-ayuda');
const sonidoNo = document.getElementById('sonido-no');
const bossMusic = document.getElementById('boss-music');
const flash = document.getElementById('flash-destello');
const zoruaImg = document.getElementById('zorua-img');
const humo = document.getElementById('humo'); // asegúrate de que este exista
const imagenes = document.querySelectorAll('.barraDeAyuda img');
const mensajeAyuda = document.getElementById('mensaje-ayuda');

imagenes[1].classList.add('bloqueado'); // Barretta
imagenes[2].classList.add('bloqueado'); // Entidad
imagenes[3].classList.add('bloqueado');

boton.addEventListener('click', () => {
    contador += incremento;
    actualizarContador();

    if (!eventoActivo && !eventoZoruaMostrado && contador >= 10) {
        mostrarEventoZorua();
    }

    if (!eventoActivo && !zoruaFinalBossAparecio && contador >= 20) {
        mostrarZoruaFinalBoss();
    }

    // DESBLOQUEO DE BARRETTA
    if (contador >= 100 && !barrettaDesbloqueada) {
        barrettaDesbloqueada = true;
        imagenes[1].classList.remove('bloqueado');
        imagenes[1].style.pointerEvents = "auto";
        mostrarMensajeAyuda("¡Has desbloqueado a Barretta!", "ayuda-barretta");

        const sonidoDesbloqueo = document.getElementById('sonido-desbloqueo');
        const sonidoClonado = sonidoDesbloqueo.cloneNode();
        sonidoClonado.play();
    }


    // DESBLOQUEO DE LA ENTIDAD
    if (contador >= 200 && !entidadDesbloqueada) {
        entidadDesbloqueada = true;
        imagenes[2].classList.remove('bloqueado');
        imagenes[2].style.pointerEvents = "auto";
        mostrarMensajeAyuda("¡La Entidad de Muerte ha sido invocada!", "ayuda-muerte");

        const sonidoDesbloqueo = document.getElementById('sonido-desbloqueo');
        const sonidoClonado = sonidoDesbloqueo.cloneNode();
        sonidoClonado.play();
    }


    if (contador >= 1000 && !lesDesbloqueado && imagenes[3].classList.contains('bloqueado')) {
        lesDesbloqueado = true;
        imagenes[3].classList.remove('bloqueado');
        mostrarMensajeAyuda("¡Has desbloqueado la ayuda automática de L_ES!", 'ayuda-es');

        const sonidoDesbloqueo = document.getElementById('sonido-desbloqueo');
        const sonidoClonado = sonidoDesbloqueo.cloneNode();
        sonidoClonado.play();
    }


});




imagenes[0].addEventListener('click', () => {
    const sonidoAuto = document.getElementById('sonido-auto');
    const clon = sonidoAuto.cloneNode();
    clon.play();

    incremento = 2;
    mostrarMensajeAyuda("¡Astley te ayuda! +2 puntos", 'ayuda-astley');
    imagenes[0].classList.add('boton-usado');

    // Animación visual
    imagenes[0].classList.add('astley-animar');
    setTimeout(() => {
        imagenes[0].classList.remove('astley-animar');
    }, 400);

    imagenes[0].style.pointerEvents = "none";
});



// USO DE BARRETTA
imagenes[1].addEventListener('click', () => {
    if (imagenes[1].classList.contains('bloqueado')) {
        mostrarMensajeAyuda("¡Necesitas al menos 100 puntos para usar a Barretta!");
        return;
    }

    if (!imagenes[1].classList.contains('boton-usado')) {
        incremento = 100;
        imagenes[1].classList.add('boton-usado');
        mostrarMensajeAyuda("¡Barretta descarga una ráfaga! Ahora sumas de 100 en 100.");

        const sonidoAuto = document.getElementById('sonido-auto');
        const sonidoClonado = sonidoAuto.cloneNode();
        sonidoClonado.play();
    } else {
        mostrarMensajeAyuda("¡Ya estás usando la potencia de Barretta!");
    }
});




// USO DE LA ENTIDAD
imagenes[2].addEventListener('click', () => {
    if (contador >= 200 && !imagenes[2].classList.contains('boton-usado')) {
        contador += 1000;
        actualizarContador();
        imagenes[2].classList.add('boton-usado');

        const sonidoAuto = document.getElementById('sonido-auto');
        const clon = sonidoAuto.cloneNode();
        clon.play();

        mostrarMensajeAyuda("¡La Entidad de Muerte te bendice con 1000 puntos!");
    } else if (imagenes[2].classList.contains('boton-usado')) {
        mostrarMensajeAyuda("¡Ya recibiste el favor de la Entidad!");
    } else {
        mostrarMensajeAyuda("¡Necesitas al menos 200 puntos para invocar a la Entidad!");
    }
});



imagenes[3].addEventListener('click', () => {
    if (imagenes[3].classList.contains('bloqueado')) {
        mostrarMensajeAyuda("¡Necesitas 1000 puntos para que L_ES te ayude!");
        return;
    }

    const sonidoAuto = document.getElementById('sonido-auto');
    const sonidoClonado = sonidoAuto.cloneNode();
    sonidoClonado.play();

    if (!autoSumando) {
        autoSumando = true;
        mostrarMensajeAyuda("¡L_ES empieza a ayudarte automáticamente!", 'ayuda-es');
        imagenes[3].classList.add('activo-l_es');

        autoIncremento = setInterval(() => {
            contador += 10;
            actualizarContador();
        }, 1000);
    } else {
        autoSumando = false;
        mostrarMensajeAyuda("L_ES ha detenido su ayuda automática.");
        clearInterval(autoIncremento);
        imagenes[3].classList.remove('activo-l_es');
    }
});




function actualizarContador() {
    contadorElemento.textContent = contador;
}


function mostrarMensajeAyuda(texto, claseExtra = '') {
    const mensajeAyuda = document.getElementById('mensaje-ayuda');
    // Reiniciar animaciones cancelando las anteriores si siguen activas
    clearTimeout(timeoutMostrar);
    clearTimeout(timeoutOcultar);

    // Reset de clases y estilos
    mensajeAyuda.className = 'mensaje-animado';
    mensajeAyuda.classList.remove('oculto', 'desaparecer');
    mensajeAyuda.offsetHeight; // Forzar reflow para reiniciar animaciones

    // Aplicar clase personalizada si hay
    if (claseExtra) {
        mensajeAyuda.classList.add(claseExtra);
    }

    // Mostrar nuevo mensaje
    mensajeAyuda.textContent = texto;
    mensajeAyuda.classList.add('mostrar');

    // Animación de desaparecer
    timeoutMostrar = setTimeout(() => {
        mensajeAyuda.classList.remove('mostrar');
        mensajeAyuda.classList.add('desaparecer');
    }, 2500);

    // Ocultar del flujo
    timeoutOcultar = setTimeout(() => {
        mensajeAyuda.classList.add('oculto');
    }, 3000);
}



function actualizarContador() {
    contadorElemento.textContent = contador;
}

function mostrarEventoZorua() {
    // document.getElementById('barra-boss-container').classList.add('oculto');
    eventoActivo = true;
    eventoZoruaMostrado = true;
    const btnSi = document.createElement('button');
    btnSi.textContent = 'Sí';
    const btnNo = document.createElement('button');
    btnNo.textContent = 'No';
    mensaje.innerHTML = '¿Quieres ayuda de un Zorua?<br>';
    eventoZorua.classList.remove('oculto');
    zoruaImg.classList.remove('enfadado');


    mensaje.appendChild(btnSi);
    mensaje.appendChild(btnNo);

    btnSi.addEventListener('click', () => {
        mensaje.textContent = 'Zorua está ayudando...';
        sonidoAyuda.play();
        zoruaAyudando = true;
        zoruaImg.src = 'img/zorua.png';

        let veces = 0;
        const intervalo = setInterval(() => {
            if (veces < 10) {
                contador += 5;
                actualizarContador();
                veces++;
            } else {
                clearInterval(intervalo);
                mensaje.textContent = 'Zorua terminó de ayudar.';

                zoruaAyudando = false;
                setTimeout(() => {
                    if (!zoruaFinalBossAparecio) {
                        document.getElementById('barra-boss-container').classList.add('oculto');
                        eventoZorua.classList.add('oculto');
                        mensaje.innerHTML = '';
                    }
                    eventoActivo = false;
                }, 2000);
            }
        }, 1000);
    });

    btnNo.addEventListener('click', () => {
        mensaje.textContent = 'Zorua se enoja y se lleva todos tus puntos...';
        sonidoNo.play();
        zoruaImg.src = 'img/ZoruaEnojado.gif';
        zoruaImg.classList.add('temblor');
        humo.classList.add('humo-activo');

        contador = 0;
        actualizarContador();

        setTimeout(() => {
            // document.getElementById('barra-boss-container').classList.add('oculto');
            eventoZorua.classList.add('oculto');
            zoruaImg.src = 'img/zorua.png';
            mensaje.innerHTML = '';
            zoruaImg.classList.remove('temblor');
            humo.classList.remove('humo-activo');
            eventoActivo = false;
        }, 3000);
    });
}

function mostrarZoruaFinalBoss() {
    document.getElementById('barra-boss-container').classList.add('oculto');

    eventoActivo = true;
    document.body.classList.add('boss-fondo');

    zoruaFinalBossAparecio = true;
    zoruaAyudando = true;

    eventoZorua.classList.remove('oculto');
    eventoZorua.classList.add('boss-position');


    zoruaImg.classList.add('boss-mode');
    zoruaImg.src = 'img/finalboss.png';
    zoruaImg.classList.add('temblor');
    bossMusic.currentTime = 0;
    bossMusic.play();

    mensaje.innerHTML = 'Zorua Final Boss ha llegado...<br>¿Creíste que sería tan fácil?<br>';

    const btnReto = document.createElement('button');
    btnReto.textContent = 'Aceptar el reto';

    const btnHuir = document.createElement('button');
    btnHuir.textContent = 'Huir';

    mensaje.appendChild(btnReto);
    mensaje.appendChild(btnHuir);

    btnReto.addEventListener('click', () => {
        mensaje.innerHTML = '¡Derrota a Zorua Final Boss!<br>Haz clic rápido para llenarlo de golpes.';
        const barraContainer = document.getElementById('barra-boss-container');
        const barra = document.getElementById('barra-boss');
        barra.style.width = '0%';
        barraContainer.classList.remove('oculto');

        let progreso = 0;
        const meta = 100;
        const incrementoPorClick = 5;
        let tiempoRestante = 10;
        let intervaloTiempo;
        let clickActivo = true;

        const aumentarBarra = () => {
            if (!clickActivo) return;
            progreso += incrementoPorClick;
            if (progreso > 100) progreso = 100;
            barra.style.width = progreso + '%';

            // 💥 Animación de golpe en zorua
            zoruaImg.classList.remove('boss-mode'); // pausa el "flotar"
            zoruaImg.classList.add('golpe');
            const golpe = document.getElementById("sonido-golpe").cloneNode();
            golpe.volume = 0.8 + Math.random() * 0.2; // Volumen entre 0.8 y 1
            golpe.playbackRate = 0.9 + Math.random() * 0.2; // Pitch variable
            golpe.play();


            setTimeout(() => {
                zoruaImg.classList.remove('golpe');
                zoruaImg.classList.add('boss-mode'); // vuelve a flotar
            }, 200);


            if (Math.random() < 0.25) {
                const frase = frasesBoss[Math.floor(Math.random() * frasesBoss.length)];
                mensaje.innerHTML = `¡Derrota a Zorua Final Boss!<br>Haz clic rápido para llenarlo de golpes.<br><br><em>"${frase}"</em>`;
            }

            if (progreso >= meta) {
                clickActivo = false;
                clearInterval(intervaloTiempo);
                barraContainer.classList.add('oculto');
                zoruaImg.classList.remove('temblor');

                mensaje.innerHTML = '<span class="mensaje-final">¡¿Q-qué estás haciendo?! ¡Nooo!</span>';
                document.getElementById("sonido-flash").play();
                flash.classList.add("flash-final");
                eventoZorua.classList.add('desaparecer-en-luz');

                setTimeout(() => {
                    eventoZorua.classList.add('ocultando');
                    document.body.classList.remove('boss-fondo');
                    document.getElementById('overlay-boss').classList.remove('activo');
                    mensaje.innerHTML = '';
                    flash.classList.remove("flash-final");
                    flash.classList.add("fundido-suave");

                    const fadeOutInterval = setInterval(() => {
                        if (bossMusic.volume > 0.05) {
                            bossMusic.volume -= 0.05;
                        } else {
                            bossMusic.volume = 0;
                            bossMusic.pause();
                            bossMusic.currentTime = 0;
                            clearInterval(fadeOutInterval);
                        }
                    }, 100);
                }, 2800);

                setTimeout(() => {
                    flash.classList.remove("fundido-suave");
                    zoruaAyudando = false;
                    eventoActivo = false;
                    eventoZorua.classList.remove('desaparecer-en-luz');
                    eventoZorua.classList.remove('ocultando');
                    eventoZorua.classList.remove('boss-position');
                    zoruaImg.classList.remove('boss-mode');
                    eventoZorua.classList.add('oculto');
                }, 5400);
            }
        };

        const clickHandler = () => aumentarBarra();
        boton.addEventListener('click', clickHandler);

        intervaloTiempo = setInterval(() => {
            tiempoRestante--;

            if (tiempoRestante <= 0) {
                clearInterval(intervaloTiempo);
                clickActivo = false;
                boton.removeEventListener('click', clickHandler);

                // Frase de burla aleatoria
                const fraseBurla = frasesDerrota[Math.floor(Math.random() * frasesDerrota.length)];
                mensaje.innerHTML = `Zorua Final Boss te ha vencido...<br><em>"${fraseBurla}"</em><br><br>Reiniciando todo...`;

                // Mostrar imagen burlona y reproducir audio
                const zoruaImg = document.getElementById('zorua-img');
                zoruaImg.src = 'img/laughing-cat.gif';
                zoruaImg.classList.add('burla-animacion');
                document.getElementById("sonido-burla-boss").play();

                // Ocultamos luego de 3.5 segundos (duración burla)
                setTimeout(() => {
                    const evento = document.getElementById('evento-zorua');

                    // Limpiar clases y animaciones
                    zoruaImg.classList.remove('boss-mode', 'burla-animacion', 'enfadado');

                    // Limpiar imagen y esconderla totalmente
                    zoruaImg.src = '';
                    zoruaImg.style.display = 'none'; // << oculta por completo

                    // Ocultar el evento con animación suave
                    evento.classList.add('ocultando');
                    setTimeout(() => {
                        evento.classList.add('oculto');
                        evento.classList.remove('ocultando');
                    }, 500);
                }, 3500);

                // Limpieza general (contador, fondo, audio, etc)
                barraContainer.classList.add('oculto');
                contador = 0;
                actualizarContador();

                setTimeout(() => {
                    // Restaurar estado inicial (sin zorua visible)
                    const eventoZorua = document.getElementById('evento-zorua');
                    mensaje.innerHTML = '';
                    zoruaAyudando = false;
                    eventoActivo = false;

                    // Limpiar clases y fondo
                    document.body.classList.remove('boss-fondo');
                    document.getElementById('overlay-boss').classList.remove('activo');

                    // Detener música del boss
                    bossMusic.pause();
                    bossMusic.currentTime = 0;

                    // Asegurarse que Zorua no se vuelva a mostrar
                    const zoruaImg = document.getElementById('zorua-img');
                    zoruaImg.src = '';
                    zoruaImg.style.display = 'none'; // por si no se ocultó antes
                }, 2000);
            }
        }, 1000);
    });



    btnHuir.addEventListener('click', () => {
        // Mostrar mensaje y reproducir sonido de burla
        mensaje.textContent = 'Logras escapar... pero pierdes la mitad de tus puntos.';
        document.getElementById("sonido-burla").play(); // Asegúrate de tener este audio en tu HTML

        // Penalización
        contador = Math.floor(contador / 2);
        actualizarContador();

        // Fade out de la música del jefe
        const fadeOutInterval = setInterval(() => {
            if (bossMusic.volume > 0.05) {
                bossMusic.volume -= 0.05;
            } else {
                bossMusic.volume = 0;
                bossMusic.pause();
                bossMusic.currentTime = 0;
                clearInterval(fadeOutInterval);
            }
        }, 100);

        // Limpiar escenario
        setTimeout(() => {
            mensaje.innerHTML = '';
            eventoZorua.classList.remove('boss-position');
            zoruaImg.classList.remove('boss-mode');

            eventoZorua.classList.add('oculto');
            zoruaImg.src = 'img/zorua.png';
            document.body.classList.remove('boss-fondo');
            document.getElementById('overlay-boss').classList.remove('activo');

            zoruaAyudando = false;
            eventoActivo = false;
        }, 3000);
    });
}



actualizarContador();

document.getElementById('barra-boss-container').classList.add('oculto');


// bossMusic.play().catch(e => console.log("No se pudo reproducir la música del boss:", e));


// Si luego querés que reaparezca Zorua en un futuro evento, solo hacés:
// zoruaImg.style.display = '';
// zoruaImg.src = 'img/zorua.png';

