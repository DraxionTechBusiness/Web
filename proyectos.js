"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("abrir-menu");
    const botonCerrar = document.getElementById("cerrar-menu");
    const menu = document.getElementById("menu-lateral");
    const fondo = document.getElementById("menu-fondo");
    const enlaces = menu?.querySelectorAll("a") ?? [];

    const anio = document.getElementById("anio");
    const anioMenu = document.getElementById("anio-menu");

    // Actualizar el año automáticamente.
    const anioActual = new Date().getFullYear();

    if (anio) {
        anio.textContent = anioActual;
    }

    if (anioMenu) {
        anioMenu.textContent = anioActual;
    }

    // Comprobar que existan los elementos del menú.
    if (!botonAbrir || !botonCerrar || !menu || !fondo) {
        console.error(
            "DraxionTech: no se encontraron todos los elementos del menú."
        );
        return;
    }

    let menuAbierto = false;

    // Abrir el menú lateral.
    function abrirMenu() {
        if (menuAbierto) return;

        menuAbierto = true;

        fondo.hidden = false;

        menu.classList.add("abierto");
        fondo.classList.add("visible");
        document.body.classList.add("menu-abierto");

        menu.inert = false;
        menu.setAttribute("aria-hidden", "false");

        botonAbrir.setAttribute("aria-expanded", "true");
        botonAbrir.setAttribute("aria-label", "Cerrar menú");

        // Mover el foco al botón de cerrar.
        botonCerrar.focus();
    }

    // Cerrar el menú lateral.
    function cerrarMenu() {
        if (!menuAbierto) return;

        menuAbierto = false;

        menu.classList.remove("abierto");
        fondo.classList.remove("visible");
        document.body.classList.remove("menu-abierto");

        menu.inert = true;
        menu.setAttribute("aria-hidden", "true");

        botonAbrir.setAttribute("aria-expanded", "false");
        botonAbrir.setAttribute("aria-label", "Abrir menú");

        // Devolver el foco al botón hamburguesa.
        botonAbrir.focus();

        // Ocultar el fondo después de la transición.
        window.setTimeout(() => {
            if (!menuAbierto) {
                fondo.hidden = true;
            }
        }, 330);
    }

    // Botones de apertura y cierre.
    botonAbrir.addEventListener("click", () => {
        if (menuAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    botonCerrar.addEventListener("click", cerrarMenu);

    // Cerrar al pulsar el fondo oscuro.
    fondo.addEventListener("click", cerrarMenu);

    // Cerrar al seleccionar un enlace.
    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", cerrarMenu);
    });

    // Cerrar con Escape.
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && menuAbierto) {
            cerrarMenu();
        }
    });

    // Cerrar si la ventana pierde el foco y el usuario vuelve
    // a la página con el menú todavía abierto.
    window.addEventListener("pageshow", () => {
        if (menuAbierto) {
            cerrarMenu();
        }
    });
});