
/* ==========================================
   DRAXIONTECH - SISTEMA DE TIENDA
   ========================================== */

const productos = {
    ia: {
        nombre: "Anuncios y trabajos con IA",
        descripcion: "Contenido creativo y soluciones con inteligencia artificial."
    },
    mantenimiento: {
        nombre: "Edición y mantenimiento de páginas web",
        descripcion: "Edición, correcciones y mantenimiento de sitios existentes."
    },
    web: {
        nombre: "Creación de páginas web",
        descripcion: "Diseño y desarrollo de páginas web personalizadas."
    },
    qr: {
        nombre: "Creación de códigos QR",
        descripcion: "Creación de códigos QR para tus proyectos."
    },
    aplicaciones: {
        nombre: "Creación de aplicaciones",
        descripcion: "Desarrollo de aplicaciones según tus necesidades."
    }
};

// Carrito de servicios seleccionados
const carrito = [];

// Elementos de la página
const contenidoCarrito = document.getElementById("contenido-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const botonCotizar = document.getElementById("solicitar-cotizacion");
const anio = document.getElementById("anio");

// Año actual del pie de página
if (anio) {
    anio.textContent = new Date().getFullYear();
}

/* ==========================================
   AÑADIR SERVICIOS AL CARRITO
   ========================================== */

document.querySelectorAll(".boton-anadir").forEach((boton) => {
    boton.addEventListener("click", () => {
        const id = boton.dataset.id;

        if (!productos[id]) {
            return;
        }

        // Evitamos añadir el mismo servicio dos veces
        if (carrito.some((producto) => producto.id === id)) {
            mostrarAviso("Este servicio ya está en tu carrito.");
            return;
        }

        carrito.push({
            id: id,
            nombre: productos[id].nombre
        });

        actualizarCarrito();
        mostrarAviso("¡Servicio añadido al carrito!");

        // Cambiamos temporalmente el texto del botón
        const textoOriginal = boton.innerHTML;
        boton.innerHTML = "Añadido ✓";

        setTimeout(() => {
            boton.innerHTML = textoOriginal;
        }, 1000);
    });
});

/* ==========================================
   MOSTRAR Y ACTUALIZAR EL CARRITO
   ========================================== */

function actualizarCarrito() {
    contenidoCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío. ¡Elegí un servicio para comenzar!
            </p>
        `;
    } else {
        carrito.forEach((producto) => {
            const elemento = document.createElement("article");
            elemento.className = "item-carrito";

            const informacion = document.createElement("div");
            const nombre = document.createElement("h3");
            const descripcion = document.createElement("p");

            nombre.textContent = producto.nombre;
            descripcion.textContent = "Precio pendiente de cotización";

            informacion.appendChild(nombre);
            informacion.appendChild(descripcion);

            const botonQuitar = document.createElement("button");
            botonQuitar.className = "boton-quitar";
            botonQuitar.textContent = "Quitar";
            botonQuitar.type = "button";

            botonQuitar.addEventListener("click", () => {
                quitarDelCarrito(producto.id);
            });

            elemento.appendChild(informacion);
            elemento.appendChild(botonQuitar);

            contenidoCarrito.appendChild(elemento);
        });
    }

    const cantidad = carrito.length;
    const textoCantidad = cantidad === 1
        ? "1 servicio"
        : `${cantidad} servicios`;

    contadorCarrito.textContent = textoCantidad;
    cantidadCarrito.textContent = cantidad;

    botonCotizar.disabled = cantidad === 0;
}

/* ==========================================
   QUITAR SERVICIOS
   ========================================== */

function quitarDelCarrito(id) {
    const indice = carrito.findIndex((producto) => producto.id === id);

    if (indice !== -1) {
        carrito.splice(indice, 1);
        actualizarCarrito();
        mostrarAviso("Servicio eliminado del carrito.");
    }
}

/* ==========================================
   MENSAJES PARA EL CLIENTE
   ========================================== */

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
            padding: "13px 22px",
            background: "#1d4ed8",
            color: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
            zIndex: "9999",
            maxWidth: "90%",
            textAlign: "center",
            fontSize: "14px"
        });

        document.body.appendChild(aviso);
    }

    aviso.textContent = mensaje;
}

/* ==========================================
   SOLICITUD DE COTIZACIÓN
   ========================================== */

botonCotizar.addEventListener("click", () => {
    if (carrito.length === 0) {
        mostrarAviso("Primero añadí un servicio al carrito.");
        return;
    }

    // Por ahora generamos un comprobante preliminar.
    // La numeración global se conectará después con Google Sheets.
    const numeroTemporal = "BORRADOR";
    const fecha = new Date().toLocaleDateString("es-CR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const ventana = window.open("", "_blank");

    if (!ventana) {
        mostrarAviso("Permití las ventanas emergentes para ver tu solicitud.");
        return;
    }

    const listaProductos = carrito.map((producto) => `
        <li>${escaparHTML(producto.nombre)}</li>
    `).join("");

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Solicitud de cotización - DraxionTech</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #111827;
                    max-width: 760px;
                    margin: 40px auto;
                    padding: 25px;
                    line-height: 1.6;
                }
                header {
                    border-bottom: 3px solid #2563eb;
                    padding-bottom: 18px;
                    margin-bottom: 25px;
                }
                h1 { color: #1d4ed8; }
                .aviso {
                    background: #eff6ff;
                    border-left: 4px solid #2563eb;
                    padding: 15px;
                    margin: 25px 0;
                }
                li { margin: 12px 0; }
                button {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                }
                @media print {
                    button { display: none; }
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <header>
                <h1>DraxionTech</h1>
                <p>Tu visión, nuestro código.</p>
            </header>

            <h2>Solicitud de cotización #${numeroTemporal}</h2>
            <p><strong>Fecha:</strong> ${escaparHTML(fecha)}</p>

            <h3>Servicios solicitados</h3>
            <ul>${listaProductos}</ul>

            <div class="aviso">
                <strong>Precios pendientes de cotización</strong>
                <p>
                    Nuestro equipo de soporte se comunicará con el cliente
                    para conocer los detalles del proyecto y definir el precio.
                </p>
                <p>Este documento no es una factura fiscal ni un comprobante de pago.</p>
            </div>

            <button onclick="window.print()">Imprimir o guardar como PDF</button>
        </body>
        </html>
    `);

    ventana.document.close();
});

/* ==========================================
   PROTECCIÓN DE TEXTO EN EL DOCUMENTO
   ========================================== */

function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, (caracter) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

// Estado inicial
actualizarCarrito();

