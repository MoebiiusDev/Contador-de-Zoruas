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
let incremento = 500;
let zoruaAyudando = false;
let zoruaFinalBossAparecio = false;
let ayudaUsada = false;
let intervaloLEs;

let barrettaDesbloqueada = false;
let entidadDesbloqueada = false;
let lesDesbloqueado = false;

let timeoutMostrar, timeoutOcultar;
let batallaFinalActiva = false;


let modoDebugBoss = true;



const contadorElemento = document.getElementById('contador');
const boton = document.getElementById('aumentar');
const eventoZorua = document.getElementById('evento-zorua-boss');
const mensaje = document.getElementById('mensaje-boss');
const sonidoAyuda = document.getElementById('sonido-ayuda');
const sonidoNo = document.getElementById('sonido-no');
const bossMusic = document.getElementById('boss-music');
const flash = document.getElementById('flash-destello');
const zoruaImg = document.getElementById('zorua-boss-img');
const humo = document.getElementById('humo'); // asegúrate de que este exista
const imagenes = document.querySelectorAll('.barraDeAyuda img');
const mensajeAyuda = document.getElementById('mensaje-ayuda');

const efectosBoss = [
    'sound/sonido-de-bonk.mp3',
    'sound/sonido-de-sarten.mp3',
    'sound/sonido-de-tacobell.mp3',
];

imagenes[1].classList.add('bloqueado'); // Barretta
imagenes[2].classList.add('bloqueado'); // Entidad
imagenes[3].classList.add('bloqueado');

boton.addEventListener('click', () => {
    contador += incremento;
    actualizarContador();

    // console.log("Contador:", contador, "| Evento activo:", eventoActivo, "| Evento Zorua mostrado:", eventoZoruaMostrado);
    if (!eventoActivo && !eventoZoruaMostrado && contador >= 10) {
        mostrarEventoChef();
    }

    if (!eventoActivo && !zoruaFinalBossAparecio && contador >= 20) {
        mostrarZoruaFinalBoss();
    }

    if (contador >= 2000 && !batallaFinalActiva) {
        iniciarBatallaUndertaleZorua();
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

function mostrarMensajeAyuda(texto, claseExtra = '') {
    // if (modoDebugBoss) return;

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
        imagenes[3].classList.add('les-activo');

        autoIncremento = setInterval(() => {
            contador += 10;
            actualizarContador();
        }, 1000);
    } else {
        autoSumando = false;
        mostrarMensajeAyuda("L_ES ha detenido su ayuda automática.");
        clearInterval(autoIncremento);
        imagenes[3].classList.remove('les-activo');
    }
});




function iniciarBatallaUndertaleZorua() {
    // if (modoDebugBoss) return;

    batallaFinalActiva = true;
    document.body.style.overflow = "hidden";
    // Reproducir sonido dramático
    const sonido = document.getElementById("sonidoTransicion");
    sonido.play();

    // Fundido
    const fondo = document.getElementById("fondoOscuro");
    fondo.style.display = "block";

    requestAnimationFrame(() => {
        fondo.style.opacity = "1";
    });
    setTimeout(() => {
        fondo.style.opacity = "1";
    }, 10);

    // setTimeout(() => {
    //     const preBoss = document.getElementById("preBoss");
    //     preBoss.style.display = "flex";


    //     const sonidoDuck = document.getElementById("sonidoDuck");
    //     sonidoDuck.play();
    // }, 8000);
    // setTimeout(() => {
    //     const preBoss2 = document.getElementById("preBoss2");
    //     const sonidoPreBoss2 = document.getElementById("sonidoPreBoss2");
    //     sonidoPreBoss2.play();
    //     preBoss.style.display = "none";
    //     preBoss2.style.display = "flex";
    // }, 10500);


    setTimeout(() => {
        const JefeUZ = document.getElementById("JefeUZ");
        const barraWena = document.getElementById("barraWena");

        JefeUZ.play();
        preBoss2.style.display = "none";
        barraWena.style.display = "flex";

        document.getElementById("zonaBatalla").style.display = "flex";
        document.body.style.overflow = "hidden";
        // fondo.style.display = "none";
    }, 1000);
}






//* Evento Cheff Zorua
function mostrarEventoChef() {
    if (modoDebugBoss) return;
    eventoActivo = true;
    eventoZoruaMostrado = true;

    const eventoChef = document.getElementById('evento-chef');
    const mensajeChef = document.getElementById('mensaje-chef');
    const zoruaChefImg = document.getElementById('zorua-chef-img');

    mensajeChef.innerHTML = '¿Quieres ayuda de un Zorua Chef?<br>';

    const btnSi = document.createElement('button');
    btnSi.className = 'btnChef';
    btnSi.textContent = 'Sí';

    const btnNo = document.createElement('button');
    btnNo.className = 'btnChef';
    btnNo.textContent = 'No';

    mensajeChef.appendChild(btnSi);
    mensajeChef.appendChild(btnNo);

    eventoChef.classList.remove('oculto');

    // Aplicar solo la animación de rebote inicial
    zoruaChefImg.style.animation = 'reboteChefZorua 0.6s ease infinite';

    btnSi.addEventListener('click', () => {
        mensajeChef.textContent = '¡Zorua Chef está cocinando puntos!';
        sonidoAyuda.play();

        // Cambiar a las animaciones rápidas y de movimiento
        zoruaChefImg.style.animation = 'reboteYMovimiento 2s ease infinite';

        let veces = 0;
        const intervalo = setInterval(() => {
            if (veces < 10) {
                contador += 5;
                actualizarContador();
                veces++;
            } else {
                clearInterval(intervalo);
                mensajeChef.textContent = 'Zorua Chef terminó de ayudar.';
                zoruaChefImg.style.animation = ''; // Restablecer la animación a la original
                setTimeout(() => {
                    eventoChef.classList.add('oculto');
                    mensajeChef.innerHTML = '';
                    eventoActivo = false;
                }, 2000);
            }
        }, 1000);
    });


    btnNo.addEventListener('click', () => {
        mensajeChef.textContent = '¡Zorua Chef se ofendió y se comió tus puntos!';
        contador = 0;
        actualizarContador();
        sonidoNo.play();

        // Cambiar la imagen del Zorua Chef
        zoruaChefImg.src = 'img/ZoruaEnojado.gif'; // Cambia 'nueva-imagen.png' por la imagen que desees

        setTimeout(() => {
            eventoChef.classList.add('oculto');
            mensajeChef.innerHTML = '';
            eventoActivo = false;
        }, 3000);
    });
}

//! Funciones Boss!!
function mostrarZoruaFinalBoss() {
    if (modoDebugBoss) return;

    document.getElementById('barra-boss-container').classList.add('oculto');

    eventoActivo = true;
    document.getElementById('boss-background').classList.add('activo');


    zoruaFinalBossAparecio = true;
    zoruaAyudando = true;

    eventoZorua.classList.remove('oculto');
    eventoZorua.classList.add('boss-position');


    zoruaImg.classList.add('boss-mode');
    mensaje.innerHTML = '¡¡¡REALMENTE CREISTE QUE SERIA FACIL!!! <br>Demuestrame tu valia!!!!<br>';
    zoruaImg.src = 'img/finalboss.png';
    zoruaImg.classList.add('temblor');
    bossMusic.currentTime = 0;

    bossMusic.play();


    const btnReto = document.createElement('button');
    btnReto.textContent = 'Aceptar el reto';
    btnReto.classList.add('glitch-boton');

    const btnHuir = document.createElement('button');
    btnHuir.textContent = 'Huir';
    btnHuir.classList.add('glitch-boton');


    const botonesBoss = document.getElementById('botones-boss');
    botonesBoss.innerHTML = ''; // limpia botones anteriores si acaso
    botonesBoss.appendChild(btnReto);
    botonesBoss.appendChild(btnHuir);


    btnReto.addEventListener('click', () => {
        const fraseAleatoria = frasesBoss[Math.floor(Math.random() * frasesBoss.length)];
        mensaje.innerHTML = '<span class="glitch-inicio">Zorua Hisuis Cariñous</span><br><em>"' + fraseAleatoria + '"</em>';

        // mensaje.classList.add('glitch');
        botonesBoss.innerHTML = ''; // oculta los botones de reto/huir

        const barraContainer = document.getElementById('barra-boss-container');
        const barra = document.getElementById('barra-boss');
        barra.style.width = '0%';
        barraContainer.classList.remove('oculto');

        let progreso = 0;
        const meta = 100;
        const incrementoPorClick = 3;
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
            reproducirEfectoBoss();


            setTimeout(() => {
                zoruaImg.classList.remove('golpe');
                zoruaImg.classList.add('boss-mode'); // vuelve a flotar
            }, 200);


            if (Math.random() < 0.25) {
                const frase = frasesBoss[Math.floor(Math.random() * frasesBoss.length)];
                mensaje.innerHTML = `<span class="glitch-inicio">Zorua Hisuis Cariñous</span><br><em>"${frase}"</em>`;
            }


            if (progreso >= meta) {
                clickActivo = false;
                clearInterval(intervaloTiempo);
                barraContainer.classList.add('oculto');
                zoruaImg.classList.remove('temblor');

                mensaje.innerHTML = '<span class="mensaje-final">IMPOSIBLEEEEEE!!!!!!!!!!!</span>';

                zoruaImg.classList.add('desintegracion');

                setTimeout(() => {
                    document.getElementById("sonido-flash").play();
                }, 1500);
                setTimeout(() => {
                    generarParticulasVictoria();
                    zoruaImg.style.display = 'none';
                }, 2500);



                flash.classList.add("flash-final");
                eventoZorua.classList.add('desaparecer-en-luz');

                setTimeout(() => {
                    flash.classList.remove("flash-final");
                    // flash.classList.add("fundido-suave");

                    const transicionSuave = document.getElementById('fondo-transicion-suave');
                    transicionSuave.style.display = 'block';

                    setTimeout(() => {
                        transicionSuave.style.opacity = '0';
                        setTimeout(() => {
                            transicionSuave.style.display = 'none';
                        }, 2000);
                    }, 50);

                    eventoZorua.classList.add('ocultando');
                    document.getElementById('overlay-boss').classList.remove('activo');
                    mensaje.innerHTML = '';
                    boton.classList.remove('boton-ataque-boss');
                    mensaje.classList.remove('glitch');

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
                }, 2500);



                const fondoBoss = document.getElementById('boss-background');
                fondoBoss.classList.remove('activo');
                fondoBoss.classList.add('desvanecer');

                setTimeout(() => {
                    setTimeout(() => {
                        fondoBoss.classList.remove('desvanecer');
                    }, 5000); // misma duración que la animación

                    // flash.classList.remove("fundido-suave");
                    zoruaAyudando = false;
                    eventoActivo = false;
                    eventoZorua.classList.remove('desaparecer-en-luz');
                    eventoZorua.classList.remove('ocultando');
                    eventoZorua.classList.remove('boss-position');
                    eventoZorua.classList.add('oculto');

                    // 🔁 Restauramos el Zorua por si se vuelve a usar después
                    zoruaImg.classList.remove('boss-mode');
                    zoruaImg.style.display = '';
                }, 5400);
            }

        };

        const clickHandler = () => aumentarBarra();
        boton.classList.add('boton-ataque-boss');

        boton.addEventListener('click', clickHandler);

        intervaloTiempo = setInterval(() => {
            tiempoRestante--;

            if (tiempoRestante <= 0) {
                clearInterval(intervaloTiempo);
                clickActivo = false;
                boton.removeEventListener('click', clickHandler);

                const zoruaImg = document.getElementById('zorua-boss-img');
                const evento = document.getElementById('evento-zorua-boss');
                const overlayBoss = document.getElementById('overlay-boss');
                const audioBurla = document.getElementById("sonido-burla-boss");
                const fondoBoss = document.getElementById('boss-background');

                // Frase de burla aleatoria
                const fraseBurla = frasesDerrota[Math.floor(Math.random() * frasesDerrota.length)];
                mensaje.innerHTML = `${fraseBurla}`;

                // Mostrar imagen burlona y animación
                zoruaImg.src = 'img/laughing-cat.gif';
                zoruaImg.classList.add('burla-animacion');
                zoruaImg.style.display = 'block';

                // Iniciar sonido de burla
                audioBurla.volume = 1;
                audioBurla.play();

                // Desvanecer sonido de burla
                const desvanecerBurla = setInterval(() => {
                    if (audioBurla.volume > 0.05) {
                        audioBurla.volume -= 0.05;
                    } else {
                        audioBurla.volume = 0;
                        audioBurla.pause();
                        audioBurla.currentTime = 0;
                        clearInterval(desvanecerBurla);
                    }
                }, 200);

                // Desvanecer música del boss también
                const desvanecerBossMusic = setInterval(() => {
                    if (bossMusic.volume > 0.05) {
                        bossMusic.volume -= 0.05;
                    } else {
                        bossMusic.volume = 0;
                        bossMusic.pause();
                        bossMusic.currentTime = 0;
                        clearInterval(desvanecerBossMusic);
                    }
                }, 200);

                // Ocultar elementos sincronizadamente
                setTimeout(() => {
                    zoruaImg.classList.add('activo');
                    mensaje.classList.add('activo');
                    barraContainer.classList.add('barra-fade-out');
                    fondoBoss.classList.remove('activo');
                    boton.classList.remove('boton-ataque-boss');

                    // ❌ Penalización: Reiniciar los puntos
                    contador = 0;
                    actualizarContador();

                    setTimeout(() => {
                        if (barraContainer) {
                            barraContainer.classList.add('oculto');
                            barraContainer.classList.remove('barra-fade-out');
                        }

                        zoruaImg.classList.remove('boss-mode', 'burla-animacion', 'enfadado');
                        zoruaImg.src = '';
                        zoruaImg.style.display = 'none';

                        mensaje.innerHTML = '';
                        evento.classList.add('oculto');
                        evento.classList.remove('ocultando');

                        zoruaAyudando = false;
                        eventoActivo = false;

                        zoruaImg.classList.remove('activo');
                        mensaje.classList.remove('activo');
                        overlayBoss.classList.remove('activo');
                    }, 1000);
                }, 3500);
            }

        }, 1000);


    });

    btnHuir.addEventListener('click', () => {
        const fondoBoss = document.getElementById('boss-background');
        // const overlayBoss = document.getElementById('overlay-boss');
        const audioBurla = document.getElementById("sonido-burla");
        const zoruaImg = document.getElementById('zorua-boss-img');
        const evento = document.getElementById('evento-zorua-boss');
        const barraContainer = document.getElementById('barra-container');

        // Mostrar burla
        mensaje.innerHTML = 'Zorua Final Boss se ríe de ti...<br><em>"Cobarde juasjuasjuas"</em>';
        zoruaImg.src = 'img/laughing-cat.gif';
        zoruaImg.classList.add('burla-animacion');
        zoruaImg.style.display = 'block';

        // Ocultar botones
        const botonesBoss = document.getElementById('botones-boss');
        if (botonesBoss) {
            botonesBoss.style.display = 'none';
        }

        // Iniciar sonido de burla
        audioBurla.volume = 1;
        audioBurla.play();

        const fadeOutBurla = setInterval(() => {
            if (audioBurla.volume > 0.05) {
                audioBurla.volume -= 0.05;
            } else {
                audioBurla.volume = 0;
                audioBurla.pause();
                audioBurla.currentTime = 0;
                clearInterval(fadeOutBurla);
            }
        }, 200);

        const fadeOutMusic = setInterval(() => {
            if (bossMusic.volume > 0.05) {
                bossMusic.volume -= 0.05;
            } else {
                bossMusic.volume = 0;
                bossMusic.pause();
                bossMusic.currentTime = 0;
                clearInterval(fadeOutMusic);
            }
        }, 200);

        // Penalización
        contador = Math.floor(contador / 2);
        actualizarContador();

        // Esperar burla y luego limpiar sincronizadamente
        setTimeout(() => {
            zoruaImg.classList.add('activo');
            mensaje.classList.add('activo');
            setTimeout(() => {
                if (barraContainer) {
                    barraContainer.classList.add('oculto');
                }
                zoruaImg.classList.remove('boss-mode', 'burla-animacion', 'enfadado');
                zoruaImg.src = '';
                zoruaImg.style.display = 'none';

                mensaje.innerHTML = '';

                evento.classList.add('oculto');
                evento.classList.remove('ocultando');
                zoruaAyudando = false;
                eventoActivo = false;

                zoruaImg.classList.remove('activo');
                mensaje.classList.remove('activo');

            }, 1000);
            fondoBoss.classList.remove('activo');

        }, 3500);
    });
}
function reproducirEfectoBoss() {
    const sonido = new Audio(efectosBoss[Math.floor(Math.random() * efectosBoss.length)]);
    sonido.volume = 0.9;
    sonido.play();
}

function generarParticulasVictoria() {
    const contenedor = document.getElementById('particulas-victoria');
    contenedor.innerHTML = ''; // Limpiar previas

    const zoruaImg = document.getElementById('zorua-boss-img');
    const contenedorRect = contenedor.getBoundingClientRect();
    const zoruaRect = zoruaImg.getBoundingClientRect();

    // Coordenadas relativas al contenedor
    const centerX = zoruaRect.left - contenedorRect.left + zoruaRect.width / 2;
    const centerY = zoruaRect.top - contenedorRect.top + zoruaRect.height / 2;

    for (let i = 0; i < 80; i++) {
        const particula = document.createElement('div');
        particula.classList.add('particula');

        particula.style.left = `${centerX}px`;
        particula.style.top = `${centerY}px`;

        const angulo = Math.random() * 2 * Math.PI;
        const distancia = Math.random() * 300 + 50;
        const x = Math.cos(angulo) * distancia + 'px';
        const y = Math.sin(angulo) * distancia + 'px';
        particula.style.setProperty('--x', x);
        particula.style.setProperty('--y', y);

        contenedor.appendChild(particula);
    }

    setTimeout(() => {
        contenedor.innerHTML = '';
    }, 5000);
}

function actualizarContador() {
    contadorElemento.textContent = contador;
}









actualizarContador();

document.getElementById('barra-boss-container').classList.add('oculto');


//! "Aceptar humillación" 😈
//! setTimeout(() => {
//!     window.close();
//! }, 5000); // luego de la burla
