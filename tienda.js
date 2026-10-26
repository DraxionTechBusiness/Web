
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

// Elementos del HTML
const botonesAnadir = document.querySelectorAll(".boton-anadir");
const botonVerCarrito = document.getElementById("ver-carrito");
const seccionCarrito = document.getElementById("carrito");
const contenidoCarrito = document.getElementById("contenido-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const botonCotizar = document.getElementById("solicitar-cotizacion");
const anio = document.getElementById("anio");


/* =========================================
   INICIALIZACIÓN
========================================= */

if (anio) {
    anio.textContent = new Date().getFullYear();
}

// El carrito empieza oculto
if (seccionCarrito) {
    seccionCarrito.hidden = true;
}

if (botonVerCarrito) {
    botonVerCarrito.setAttribute("aria-expanded", "false");
    actualizarTextoBotonCarrito();
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

        // Evitar añadir el mismo servicio más de una vez
        if (carrito.includes(id)) {
            mostrarAviso("Ese servicio ya está en tu carrito.");
            return;
        }

        carrito.push(id);

        actualizarCarrito();
        mostrarAviso("Servicio añadido al carrito.");

        // Confirmación visual temporal en el botón
        const textoOriginal = boton.textContent;
        boton.textContent = "Añadido ✓";
        boton.disabled = true;

        setTimeout(() => {
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }, 900);
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
    if (!contenidoCarrito) return;

    contenidoCarrito.replaceChildren();

    if (carrito.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "carrito-vacio";
        mensaje.textContent = "Todavía no has añadido servicios.";

        contenidoCarrito.appendChild(mensaje);
    } else {
        carrito.forEach((id) => {
            const producto = productos[id];

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

    if (contadorCarrito) {
        contadorCarrito.textContent = carrito.length;
    }

    if (cantidadCarrito) {
        cantidadCarrito.textContent = carrito.length;
    }

    actualizarTextoBotonCarrito();

    // Activar o desactivar el botón de cotización
    if (botonCotizar) {
        botonCotizar.disabled = carrito.length === 0;
    }

    // Sincronizar los botones del catálogo con el carrito
    botonesAnadir.forEach((boton) => {
        const seleccionado = carrito.includes(boton.dataset.producto);

        boton.disabled = seleccionado;
        boton.textContent = seleccionado
            ? "Añadido ✓"
            : "Añadir al carrito";
    });
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

    // Reiniciar el temporizador si hay otro aviso
    if (aviso._temporizador) {
        clearTimeout(aviso._temporizador);
    }

    aviso._temporizador = setTimeout(() => {
        aviso.hidden = true;
    }, 2500);
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

    const fecha = new Date();

    const fechaFormato = fecha.toLocaleDateString("es-CR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const horaFormato = fecha.toLocaleTimeString("es-CR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    // Por ahora es un identificador local provisional.
    // Más adelante se conectará un contador centralizado.
    const numeroTemporal = "PENDIENTE";

    const ventana = window.open("", "_blank");

    if (!ventana) {
        mostrarAviso(
            "El navegador bloqueó la ventana. Permite las ventanas emergentes e inténtalo de nuevo."
        );
        return;
    }

    const listaServicios = carrito
        .map((id) => {
            const producto = productos[id];

            return `
                <li>
                    <strong>${escaparHTML(producto.nombre)}</strong>
                    <p>${escaparHTML(producto.descripcion)}</p>
                </li>
            `;
        })
        .join("");

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Solicitud de cotización - DraxionTech</title>

            <style>
                body {
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 24px;
                    color: #1f2937;
                    font-family: Arial, Helvetica, sans-serif;
                    line-height: 1.6;
                }

                header {
                    padding-bottom: 18px;
                    border-bottom: 3px solid #2563eb;
                }

                h1 {
                    color: #2563eb;
                    margin-bottom: 4px;
                }

                h2 {
                    margin-top: 28px;
                }

                li {
                    margin: 18px 0;
                    padding: 14px;
                    background: #f3f4f6;
                    border-radius: 6px;
                }

                li p {
                    margin-bottom: 0;
                }

                .aviso {
                    margin-top: 24px;
                    padding: 16px;
                    background: #eff6ff;
                    border-left: 4px solid #2563eb;
                }

                button {
                    margin-top: 24px;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 6px;
                    background: #2563eb;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                }

                @media print {
                    button {
                        display: none;
                    }

                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
            </style>
        </head>

        <body>
            <header>
                <h1>DraxionTech</h1>
                <p>Tu visión, nuestro código.</p>
            </header>

            <h2>Solicitud de cotización #${numeroTemporal}</h2>

            <p><strong>Fecha:</strong> ${escaparHTML(fechaFormato)}</p>
            <p><strong>Hora:</strong> ${escaparHTML(horaFormato)}</p>

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

            <button onclick="window.print()">Imprimir o guardar como PDF</button>
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
