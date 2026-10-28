
/* =========================================
   DRAXIONTECH — MENÚ LATERAL
========================================= */

const botonAbrirMenu = document.getElementById("abrir-menu");
const botonCerrarMenu = document.getElementById("cerrar-menu");
const menuLateral = document.getElementById("menu-lateral");
const fondoMenu = document.getElementById("menu-fondo");
const anioMenu = document.getElementById("anio-menu");

let elementoAntesDeAbrir = null;

if (anioMenu) {
    anioMenu.textContent = new Date().getFullYear();
}

function abrirMenuLateral() {
    if (!menuLateral || !fondoMenu || !botonAbrirMenu) return;

    elementoAntesDeAbrir = document.activeElement;

    menuLateral.inert = false;
    menuLateral.setAttribute("aria-hidden", "false");
    fondoMenu.hidden = false;

    requestAnimationFrame(() => {
        menuLateral.classList.add("abierto");
        fondoMenu.classList.add("visible");
    });

    document.body.classList.add("menu-abierto");
    botonAbrirMenu.setAttribute("aria-expanded", "true");

    if (botonCerrarMenu) {
        botonCerrarMenu.focus();
    }
}

function cerrarMenuLateral() {
    if (!menuLateral || !fondoMenu || !botonAbrirMenu) return;

    menuLateral.classList.remove("abierto");
    fondoMenu.classList.remove("visible");
    document.body.classList.remove("menu-abierto");

    botonAbrirMenu.setAttribute("aria-expanded", "false");
    menuLateral.setAttribute("aria-hidden", "true");
    menuLateral.inert = true;

    fondoMenu.hidden = true;

    if (elementoAntesDeAbrir instanceof HTMLElement) {
        elementoAntesDeAbrir.focus();
    }
}

if (botonAbrirMenu) {
    botonAbrirMenu.addEventListener("click", abrirMenuLateral);
}

if (botonCerrarMenu) {
    botonCerrarMenu.addEventListener("click", cerrarMenuLateral);
}

if (fondoMenu) {
    fondoMenu.addEventListener("click", cerrarMenuLateral);
}

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menuLateral?.classList.contains("abierto")) {
        cerrarMenuLateral();
    }
});

if (menuLateral) {
    menuLateral.querySelectorAll("a").forEach((enlace) => {
        enlace.addEventListener("click", cerrarMenuLateral);
    });
}


"use strict";

/* =========================================
   DRAXIONTECH — CATÁLOGO Y CARRITO
========================================= */

// Servicios disponibles
const productos = {
    ia: {
        nombre: "Anuncios y trabajos con IA",
        descripcion: "Contenido creativo y recursos elaborados con inteligencia artificial."
    },
    mantenimiento: {
        nombre: "Edición y mantenimiento web",
        descripcion: "Actualizaciones, mejoras y mantenimiento de páginas existentes."
    },
    web: {
        nombre: "Creación de páginas web",
        descripcion: "Páginas personalizadas para negocios, proyectos e ideas."
    },
    qr: {
        nombre: "Creación de códigos QR",
        descripcion: "Códigos QR para páginas web y otros recursos digitales."
    },
    aplicaciones: {
        nombre: "Creación de aplicaciones",
        descripcion: "Aplicaciones adaptadas a las necesidades de cada proyecto."
    }
};

// Estado del carrito
const carrito = [];

// Elementos HTML
const botonesAnadir = document.querySelectorAll(".boton-anadir");
const botonVerCarrito = document.getElementById("ver-carrito");
const seccionCarrito = document.getElementById("carrito");
const contenidoCarrito = document.getElementById("contenido-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const botonCotizar = document.getElementById("solicitar-cotizacion");
const anio = document.getElementById("anio");

// Datos del cliente
const formularioCliente = document.getElementById("datos-cliente");
const campoNombre = document.getElementById("nombre-cliente");
const campoCorreo = document.getElementById("correo-cliente");

const CLAVE_CONTADOR = "draxiontech_ultimo_numero_cotizacion";


/* =========================================
   INICIALIZACIÓN
========================================= */

if (anio) {
    anio.textContent = new Date().getFullYear();
}

if (seccionCarrito) {
    seccionCarrito.hidden = true;
}

if (botonVerCarrito) {
    botonVerCarrito.setAttribute("aria-expanded", "false");
    actualizarTextoBotonCarrito();
}

if (formularioCliente) {
    formularioCliente.addEventListener("submit", (evento) => {
        evento.preventDefault();
        generarCotizacion();
    });
}


/* =========================================
   NUMERACIÓN LOCAL DE COTIZACIONES
========================================= */

function obtenerSiguienteCodigo() {
    try {
        let ultimoNumero = Number(
            localStorage.getItem(CLAVE_CONTADOR) || 0
        );

        if (!Number.isSafeInteger(ultimoNumero) || ultimoNumero < 0) {
            ultimoNumero = 0;
        }

        const siguienteNumero = ultimoNumero + 1;

        localStorage.setItem(
            CLAVE_CONTADOR,
            String(siguienteNumero)
        );

        return "DRX-" + String(siguienteNumero).padStart(4, "0");
    } catch (error) {
        return null;
    }
}


/* =========================================
   AÑADIR SERVICIOS
========================================= */

botonesAnadir.forEach((boton) => {
    boton.addEventListener("click", () => {
        const id = boton.dataset.producto;

        if (!productos[id]) {
            mostrarAviso("No se encontró ese servicio.");
            return;
        }

        if (carrito.includes(id)) {
            mostrarAviso("Ese servicio ya está en tu carrito.");
            return;
        }

        carrito.push(id);
        actualizarCarrito();
        mostrarAviso("Servicio añadido al carrito.");
    });
});


/* =========================================
   VER Y OCULTAR EL CARRITO
========================================= */

if (botonVerCarrito && seccionCarrito) {
    botonVerCarrito.addEventListener("click", () => {
        const mostrar = seccionCarrito.hidden;

        seccionCarrito.hidden = !mostrar;

        botonVerCarrito.setAttribute(
            "aria-expanded",
            String(mostrar)
        );

        actualizarTextoBotonCarrito();

        if (mostrar) {
            seccionCarrito.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

function actualizarTextoBotonCarrito() {
    if (!botonVerCarrito) return;

    const cantidad = carrito.length;
    const estaAbierto = seccionCarrito
        ? !seccionCarrito.hidden
        : false;

    botonVerCarrito.textContent = estaAbierto
        ? `Ocultar carrito (${cantidad})`
        : `Ver carrito (${cantidad})`;
}


/* =========================================
   MOSTRAR Y ACTUALIZAR EL CARRITO
========================================= */

function actualizarCarrito() {
    if (contenidoCarrito) {
        contenidoCarrito.replaceChildren();

        if (carrito.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.className = "carrito-vacio";
            mensaje.textContent = "Todavía no has añadido servicios.";

            contenidoCarrito.appendChild(mensaje);
        } else {
            carrito.forEach((id) => {
                const producto = productos[id];
                if (!producto) return;

                const elemento = document.createElement("article");
                elemento.className = "item-carrito";

                const informacion = document.createElement("div");

                const titulo = document.createElement("h3");
                titulo.textContent = producto.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = producto.descripcion;

                informacion.append(titulo, descripcion);

                const botonQuitar = document.createElement("button");
                botonQuitar.type = "button";
                botonQuitar.className = "boton-quitar";
                botonQuitar.textContent = "Quitar";
                botonQuitar.setAttribute(
                    "aria-label",
                    `Quitar ${producto.nombre} del carrito`
                );

                botonQuitar.addEventListener("click", () => {
                    quitarDelCarrito(id);
                });

                elemento.append(informacion, botonQuitar);
                contenidoCarrito.appendChild(elemento);
            });
        }
    }

    if (contadorCarrito) {
        contadorCarrito.textContent = carrito.length;
    }

    if (cantidadCarrito) {
        cantidadCarrito.textContent = carrito.length;
    }

    actualizarTextoBotonCarrito();

    if (botonCotizar) {
        botonCotizar.disabled =
            carrito.length === 0 ||
            !formularioCliente ||
            !campoNombre ||
            !campoCorreo;
    }

    botonesAnadir.forEach((boton) => {
        const seleccionado = carrito.includes(boton.dataset.producto);

        boton.disabled = seleccionado;
        boton.textContent = seleccionado
            ? "Añadido ✓"
            : "Añadir al carrito";
    });
}


/* =========================================
   VALIDAR DATOS DEL CLIENTE
========================================= */

function obtenerDatosCliente() {
    if (!formularioCliente || !campoNombre || !campoCorreo) {
        mostrarAviso("No se encontraron los campos del cliente.");
        return null;
    }

    if (!formularioCliente.reportValidity()) {
        return null;
    }

    const nombre = campoNombre.value.trim();
    const correo = campoCorreo.value.trim();

    if (!nombre || !correo) {
        mostrarAviso("Completa tu nombre y correo electrónico.");
        return null;
    }

    if (/[\r\n]/.test(nombre) || /[\r\n]/.test(correo)) {
        mostrarAviso("Revisa los datos ingresados.");
        return null;
    }

    return { nombre, correo };
}


/* =========================================
   QUITAR SERVICIOS
========================================= */

function quitarDelCarrito(id) {
    const indice = carrito.indexOf(id);

    if (indice === -1) return;

    carrito.splice(indice, 1);

    actualizarCarrito();
    mostrarAviso("Servicio eliminado del carrito.");
}


/* =========================================
   AVISOS AL USUARIO
========================================= */

function mostrarAviso(mensaje) {
    let aviso = document.getElementById("aviso-tienda");

    if (!aviso) {
        aviso = document.createElement("div");
        aviso.id = "aviso-tienda";
        aviso.setAttribute("role", "status");
        aviso.setAttribute("aria-live", "polite");

        Object.assign(aviso.style, {
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1000",
            maxWidth: "90%",
            boxSizing: "border-box",
            padding: "12px 20px",
            background: "#1f2937",
            color: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            textAlign: "center"
        });

        document.body.appendChild(aviso);
    }

    aviso.textContent = mensaje;
    aviso.hidden = false;

    if (aviso._temporizador) {
        clearTimeout(aviso._temporizador);
    }

    aviso._temporizador = setTimeout(() => {
        aviso.hidden = true;
    }, 3000);
}


/* =========================================
   SOLICITUD DE COTIZACIÓN
========================================= */

if (botonCotizar) {
    botonCotizar.addEventListener("click", generarCotizacion);
}

function generarCotizacion() {
    if (carrito.length === 0) {
        mostrarAviso("Añade al menos un servicio antes de cotizar.");
        return;
    }

    const cliente = obtenerDatosCliente();

    if (!cliente) return;

    // Abrir la ventana durante la acción del usuario.
    const ventana = window.open("", "_blank");

    if (!ventana) {
        mostrarAviso(
            "El navegador bloqueó la ventana. Permite las ventanas emergentes e inténtalo de nuevo."
        );
        return;
    }

    // Crear el código después de abrir la ventana.
    const codigo = obtenerSiguienteCodigo();

    if (!codigo) {
        ventana.close();
        mostrarAviso(
            "No se pudo guardar el contador en este navegador."
        );
        return;
    }

    const fecha = new Date();

    const fechaFormato = fecha.toLocaleDateString("es-CR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const horaFormato = fecha.toLocaleTimeString("es-CR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const listaServicios = carrito
        .map((id) => {
            const producto = productos[id];
            if (!producto) return "";

            return `
                <li>
                    <strong>${escaparHTML(producto.nombre)}</strong>
                    <p>${escaparHTML(producto.descripcion)}</p>
                </li>
            `;
        })
        .join("");

    const nombreSeguro = escaparHTML(cliente.nombre);
    const correoSeguro = escaparHTML(cliente.correo);

    ventana.document.open();

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>${escaparHTML(codigo)} - DraxionTech</title>

            <style>
                * {
                    box-sizing: border-box;
                }

                html {
                    width: 100%;
                    -webkit-text-size-adjust: 100%;
                    text-size-adjust: 100%;
                }

                body {
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 24px;
                    color: #1f2937;
                    background: #ffffff;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    overflow-wrap: anywhere;
                }

                header {
                    padding-bottom: 18px;
                    border-bottom: 3px solid #2563eb;
                }

                h1 {
                    margin: 0 0 4px;
                    color: #2563eb;
                    font-size: 30px;
                    line-height: 1.25;
                }

                h2 {
                    margin-top: 28px;
                    font-size: 21px;
                    line-height: 1.35;
                }

                p {
                    margin: 10px 0;
                }

                .datos {
                    padding: 16px;
                    margin-top: 20px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                }

                .datos p {
                    margin: 6px 0;
                }

                ol {
                    padding-left: 26px;
                }

                li {
                    margin: 18px 0;
                    padding: 14px;
                    background: #f3f4f6;
                    border-radius: 6px;
                    overflow-wrap: anywhere;
                }

                li p {
                    margin-bottom: 0;
                }

                .aviso {
                    margin-top: 24px;
                    padding: 16px;
                    background: #eff6ff;
                    border-left: 4px solid #2563eb;
                    border-radius: 4px;
                }

                .instrucciones-contacto {
                    margin-top: 28px;
                    padding: 18px;
                    border: 2px solid #2563eb;
                    border-radius: 10px;
                    font-size: 15px;
                    line-height: 1.65;
                    break-inside: avoid;
                }

                .instrucciones-contacto h2 {
                    margin: 0 0 12px;
                    color: #1d4ed8;
                    font-size: 21px;
                }

                .aviso-contacto {
                    margin-top: 16px;
                    padding: 12px;
                    background: #f3f4f6;
                    border-radius: 6px;
                    font-size: 14px;
                }

                .firma-draxion {
                    margin-top: 20px;
                    text-align: center;
                }

                .boton-imprimir {
                    display: block;
                    width: 100%;
                    margin: 24px 0;
                    padding: 14px 18px;
                    border: none;
                    border-radius: 8px;
                    background: #2563eb;
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                }

                @media screen and (max-width: 600px) {
                    body {
                        width: 100%;
                        max-width: none;
                        margin: 0;
                        padding: 18px;
                        font-size: 16px;
                    }

                    h1 {
                        font-size: 27px;
                    }

                    h2 {
                        font-size: 20px;
                    }

                    .instrucciones-contacto {
                        padding: 15px;
                    }
                }

                @media print {
                    @page {
                        size: A4;
                        margin: 12mm;
                    }

                    body {
                        width: auto;
                        max-width: none;
                        margin: 0;
                        padding: 0;
                        font-size: 11pt;
                    }

                    .boton-imprimir {
                        display: none !important;
                    }

                    li,
                    .aviso,
                    .instrucciones-contacto,
                    .datos {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            </style>
        </head>

        <body>
            <header>
                <h1>DraxionTech</h1>
                <p><em>Tu visión, nuestro código.</em></p>
            </header>

            <h2>Solicitud de cotización #${escaparHTML(codigo)}</h2>

            <section class="datos">
                <h2>Datos del cliente</h2>

                <p><strong>Nombre:</strong> ${nombreSeguro}</p>
                <p><strong>Correo:</strong> ${correoSeguro}</p>
                <p><strong>Fecha:</strong> ${escaparHTML(fechaFormato)}</p>
                <p><strong>Hora:</strong> ${escaparHTML(horaFormato)}</p>
            </section>

            <h2>Servicios solicitados</h2>

            <ol>
                ${listaServicios}
            </ol>

            <div class="aviso">
                <strong>Información importante</strong>

                <p>
                    Esta solicitud no contiene precios. El costo se determinará
                    después de revisar las necesidades y el alcance del proyecto.
                </p>

                <p>
                    Este documento no es una factura fiscal ni un comprobante de pago.
                </p>
            </div>

            <section class="instrucciones-contacto">
                <h2>¿Qué sigue con tu cotización?</h2>

                <p>
                    Para continuar con tu proyecto,
                    <strong>envía esta cotización por mensaje privado
                    a DraxionTech en Facebook o Instagram.</strong>
                </p>

                <p>
                    Así podremos identificar tu solicitud, revisar los servicios
                    que te interesan y conversar contigo sobre los siguientes pasos.
                </p>

                <p class="aviso-contacto">
                    <strong>Importante:</strong>
                    generar esta cotización no significa que hayamos recibido
                    tu solicitud. Debes enviárnosla por uno de nuestros chats
                    oficiales para que podamos atenderte.
                </p>

                <p class="firma-draxion">
                    <strong>DraxionTech</strong><br>
                    <em>Tu visión, nuestro código.</em>
                </p>
            </section>

            <button
                class="boton-imprimir"
                type="button"
                onclick="window.print()"
            >
                Imprimir o guardar como PDF
            </button>
        </body>
        </html>
    `);

    ventana.document.close();
}


/* =========================================
   SEGURIDAD: ESCAPAR TEXTO HTML
========================================= */

function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, (caracter) => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entidades[caracter];
    });
}


/* =========================================
   ESTADO INICIAL
========================================= */

actualizarCarrito();

