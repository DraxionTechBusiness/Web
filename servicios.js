
/* ==========================================
   DRAXIONTECH — MENÚ LATERAL
========================================== */

(() => {
    "use strict";

    const botonAbrir = document.getElementById("abrir-menu");
    const botonCerrar = document.getElementById("cerrar-menu");
    const menu = document.getElementById("menu-lateral");
    const fondo = document.getElementById("menu-fondo");

    // Evita errores si esta página no contiene el menú.
    if (!botonAbrir || !botonCerrar || !menu || !fondo) {
        return;
    }

    let menuAbierto = false;

    function obtenerElementosEnfocables() {
        return Array.from(
            menu.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter((elemento) => {
            return elemento.getAttribute("aria-hidden") !== "true";
        });
    }

    function abrirMenu() {
        if (menuAbierto) return;

        menuAbierto = true;

        menu.classList.add("abierto");
        menu.removeAttribute("inert");
        menu.setAttribute("aria-hidden", "false");

        fondo.hidden = false;

        botonAbrir.setAttribute("aria-expanded", "true");
        botonAbrir.setAttribute("aria-label", "Cerrar menú");

        document.body.classList.add("menu-abierto");

        botonCerrar.focus();
    }

    function cerrarMenu(restaurarFoco = true) {
        if (!menuAbierto) return;

        menuAbierto = false;

        menu.classList.remove("abierto");
        menu.setAttribute("inert", "");
        menu.setAttribute("aria-hidden", "true");

        fondo.hidden = true;

        botonAbrir.setAttribute("aria-expanded", "false");
        botonAbrir.setAttribute("aria-label", "Abrir menú");

        document.body.classList.remove("menu-abierto");

        if (restaurarFoco) {
            botonAbrir.focus();
        }
    }

    // Abrir el menú.
    botonAbrir.addEventListener("click", () => {
        if (menuAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    // Cerrar con la X.
    botonCerrar.addEventListener("click", () => {
        cerrarMenu();
    });

    // Cerrar al pulsar fuera del panel.
    fondo.addEventListener("click", () => {
        cerrarMenu();
    });

    // Cerrar con Escape y facilitar la navegación por teclado.
    document.addEventListener("keydown", (evento) => {
        if (!menuAbierto) return;

        if (evento.key === "Escape") {
            evento.preventDefault();
            cerrarMenu();
            return;
        }

        if (evento.key === "Tab") {
            const elementos = obtenerElementosEnfocables();

            if (elementos.length === 0) {
                evento.preventDefault();
                botonCerrar.focus();
                return;
            }

            const primero = elementos[0];
            const ultimo = elementos[elementos.length - 1];

            if (
                evento.shiftKey &&
                document.activeElement === primero
            ) {
                evento.preventDefault();
                ultimo.focus();
            } else if (
                !evento.shiftKey &&
                document.activeElement === ultimo
            ) {
                evento.preventDefault();
                primero.focus();
            }
        }
    });

    // Cerrar el menú al seleccionar una página.
    menu.querySelectorAll("a[href]").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            cerrarMenu(false);
        });
    });

    // Estado inicial.
    menu.classList.remove("abierto");
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("inert", "");

    fondo.hidden = true;

    botonAbrir.setAttribute("aria-expanded", "false");
    botonAbrir.setAttribute("aria-label", "Abrir menú");

    document.body.classList.remove("menu-abierto");
})();
