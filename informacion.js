
/* ==========================================
   DRAXIONTECH — INFORMACIÓN
   Menú lateral y animaciones
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("abrir-menu");
    const botonCerrar = document.getElementById("cerrar-menu");
    const menu = document.getElementById("menu-lateral");
    const fondo = document.getElementById("menu-fondo");

    if (!botonAbrir || !botonCerrar || !menu || !fondo) {
        console.warn(
            "DraxionTech: no se encontraron todos los elementos del menú."
        );
        return;
    }

    let menuAbierto = false;
    let ultimoElementoEnfocado = null;

    function abrirMenu() {
        if (menuAbierto) return;

        menuAbierto = true;
        ultimoElementoEnfocado = document.activeElement;

        fondo.hidden = false;

        // Permite que el navegador registre el estado inicial
        // antes de aplicar la transición visual.
        requestAnimationFrame(() => {
            if (!menuAbierto) return;

            fondo.classList.add("visible");
            menu.classList.add("abierto");
        });

        document.body.classList.add("menu-abierto");

        menu.setAttribute("aria-hidden", "false");
        menu.inert = false;

        botonAbrir.setAttribute("aria-expanded", "true");
        botonAbrir.setAttribute("aria-label", "Cerrar menú");

        botonCerrar.focus();
    }

    function cerrarMenu({ devolverFoco = true } = {}) {
        if (!menuAbierto) return;

        menuAbierto = false;

        menu.classList.remove("abierto");
        fondo.classList.remove("visible");

        document.body.classList.remove("menu-abierto");

        menu.setAttribute("aria-hidden", "true");
        menu.inert = true;

        botonAbrir.setAttribute("aria-expanded", "false");
        botonAbrir.setAttribute("aria-label", "Abrir menú");

        // Oculta el fondo al terminar la transición.
        function ocultarFondo(evento) {
            if (evento && evento.target !== fondo) return;

            if (!menuAbierto) {
                fondo.hidden = true;
            }

            fondo.removeEventListener(
                "transitionend",
                ocultarFondo
            );
        }

        fondo.addEventListener(
            "transitionend",
            ocultarFondo
        );

        // Respaldo si la transición no genera transitionend.
        // No se necesita temporizador: la visibilidad se mantiene
        // controlada por el estado de la interfaz.
        if (devolverFoco && ultimoElementoEnfocado instanceof HTMLElement) {
            ultimoElementoEnfocado.focus();
        } else if (devolverFoco) {
            botonAbrir.focus();
        }
    }

    botonAbrir.addEventListener("click", () => {
        if (menuAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    botonCerrar.addEventListener("click", () => {
        cerrarMenu();
    });

    fondo.addEventListener("click", () => {
        cerrarMenu();
    });

    // Cierra el menú con Escape.
    document.addEventListener("keydown", (evento) => {
        if (!menuAbierto) return;

        if (evento.key === "Escape") {
            evento.preventDefault();
            cerrarMenu();
            return;
        }

        // Mantiene el foco dentro del panel mientras está abierto.
        if (evento.key === "Tab") {
            const elementos = menu.querySelectorAll(
                'a[href], button:not([disabled]), ' +
                'input:not([disabled]), select:not([disabled]), ' +
                'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            const visibles = Array.from(elementos).filter(
                (elemento) =>
                    elemento.getClientRects().length > 0
            );

            if (visibles.length === 0) {
                evento.preventDefault();
                botonCerrar.focus();
                return;
            }

            const primero = visibles[0];
            const ultimo = visibles[visibles.length - 1];

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

    // Cierra el menú al elegir una página.
    menu.querySelectorAll("a[href]").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            cerrarMenu({ devolverFoco: false });
        });
    });

    // Evita dejar el menú abierto al volver a una pestaña
    // o ventana en un estado de navegación diferente.
    window.addEventListener("pageshow", () => {
        if (menuAbierto) {
            cerrarMenu({ devolverFoco: false });
        }
    });

    // ======================================
    // APARICIÓN PROGRESIVA AL DESPLAZARSE
    // ======================================

    const elementosAnimados = document.querySelectorAll(
        ".animacion-scroll"
    );

    const movimientoReducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function mostrarTodos() {
        elementosAnimados.forEach((elemento) => {
            elemento.classList.add("visible");
        });
    }

    if (
        movimientoReducido.matches ||
        !("IntersectionObserver" in window)
    ) {
        mostrarTodos();
    } else {
        const observador = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach((entrada) => {
                    if (!entrada.isIntersecting) return;

                    entrada.target.classList.add("visible");
                    observer.unobserve(entrada.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        elementosAnimados.forEach((elemento, indice) => {
            // Aparición escalonada de las tarjetas.
            if (elemento.classList.contains("tarjeta")) {
                const numeroTarjeta = Array.from(
                    elemento.parentElement.children
                ).indexOf(elemento);

                elemento.style.setProperty(
                    "--retraso",
                    `${numeroTarjeta * 100}ms`
                );
            }

            observador.observe(elemento);
        });
    }
});
