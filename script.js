
/* ==========================================
   DRAXIONTECH — SCRIPT PRINCIPAL
   Menú lateral interactivo y accesible
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

    // Elementos que pueden recibir el foco dentro del menú.
    function obtenerElementosEnfocables() {
        return Array.from(
            menu.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter((elemento) => {
            return elemento.getAttribute("aria-hidden") !== "true";
        });
    }

    // Abre el menú.
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

        // Lleva el foco al botón de cierre.
        botonCerrar.focus();
    }

    // Cierra el menú.
    function cerrarMenu({ restaurarFoco = true } = {}) {
        if (!menuAbierto) return;

        menuAbierto = false;

        menu.classList.remove("abierto");

        // Impide navegar por los enlaces cuando el menú está cerrado.
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

    // Botón hamburguesa: abrir o cerrar.
    botonAbrir.addEventListener("click", () => {
        if (menuAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    // Botón X.
    botonCerrar.addEventListener("click", () => {
        cerrarMenu();
    });

    // Cierra al tocar el fondo oscuro.
    fondo.addEventListener("click", () => {
        cerrarMenu();
    });

    // Teclas Escape y Tab.
    document.addEventListener("keydown", (evento) => {
        if (!menuAbierto) return;

        if (evento.key === "Escape") {
            evento.preventDefault();
            cerrarMenu();
            return;
        }

        // Mantiene el foco dentro del menú mientras está abierto.
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

    // Cierra el menú al seleccionar una página.
    menu.querySelectorAll("a[href]").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            cerrarMenu({ restaurarFoco: false });
        });
    });

    // Estado inicial: menú cerrado.
    menu.classList.remove("abierto");
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("inert", "");

    fondo.hidden = true;

    botonAbrir.setAttribute("aria-expanded", "false");
    botonAbrir.setAttribute("aria-label", "Abrir menú");

    document.body.classList.remove("menu-abierto");
})();

