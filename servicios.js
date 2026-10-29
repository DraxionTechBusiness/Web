
/* ========================================
   DRAXIONTECH — SERVICIOS
   Control del menú lateral
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("abrir-menu");
    const botonCerrar = document.getElementById("cerrar-menu");
    const menu = document.getElementById("menu-lateral");
    const fondo = document.getElementById("menu-fondo");

    if (!botonAbrir || !botonCerrar || !menu || !fondo) {
        console.error("DraxionTech: no se encontraron los elementos del menú.");
        return;
    }

    function abrirMenu() {
        menu.classList.add("abierto");
        fondo.hidden = false;
        document.body.classList.add("menu-abierto");

        menu.setAttribute("aria-hidden", "false");
        menu.removeAttribute("inert");
        botonAbrir.setAttribute("aria-expanded", "true");

        botonCerrar.focus();
    }

    function cerrarMenu() {
        menu.classList.remove("abierto");
        fondo.hidden = true;
        document.body.classList.remove("menu-abierto");

        menu.setAttribute("aria-hidden", "true");
        menu.setAttribute("inert", "");
        botonAbrir.setAttribute("aria-expanded", "false");

        botonAbrir.focus();
    }

    botonAbrir.addEventListener("click", abrirMenu);
    botonCerrar.addEventListener("click", cerrarMenu);
    fondo.addEventListener("click", cerrarMenu);

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && menu.classList.contains("abierto")) {
            cerrarMenu();
        }
    });

    menu.querySelectorAll("a").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            menu.classList.remove("abierto");
            fondo.hidden = true;
            document.body.classList.remove("menu-abierto");

            menu.setAttribute("aria-hidden", "true");
            menu.setAttribute("inert", "");
            botonAbrir.setAttribute("aria-expanded", "false");
        });
    });
});
