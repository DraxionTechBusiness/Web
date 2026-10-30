
document.addEventListener("DOMContentLoaded", () => {

    const botonAbrir = document.getElementById("abrir-menu");
    const botonCerrar = document.getElementById("cerrar-menu");
    const menu = document.getElementById("menu-lateral");
    const fondo = document.getElementById("menu-fondo");

    if (!botonAbrir || !botonCerrar || !menu || !fondo) {
        console.warn("No se encontraron todos los elementos del menú.");
        return;
    }

    // ABRIR MENÚ
    function abrirMenu() {
        menu.classList.add("abierto");
        fondo.hidden = false;

        menu.setAttribute("aria-hidden", "false");
        menu.removeAttribute("inert");

        botonAbrir.setAttribute("aria-expanded", "true");

        document.body.style.overflow = "hidden";

        botonCerrar.focus();
    }

    // CERRAR MENÚ
    function cerrarMenu() {
        menu.classList.remove("abierto");

        menu.setAttribute("aria-hidden", "true");
        menu.setAttribute("inert", "");

        botonAbrir.setAttribute("aria-expanded", "false");

        document.body.style.overflow = "";

        fondo.hidden = true;

        botonAbrir.focus();
    }

    // EVENTOS DE LOS BOTONES
    botonAbrir.addEventListener("click", abrirMenu);
    botonCerrar.addEventListener("click", cerrarMenu);

    // CERRAR AL TOCAR EL FONDO
    fondo.addEventListener("click", cerrarMenu);

    // CERRAR CON ESCAPE
    document.addEventListener("keydown", (evento) => {
        if (
            evento.key === "Escape" &&
            menu.classList.contains("abierto")
        ) {
            cerrarMenu();
        }
    });

    // CERRAR AL NAVEGAR A OTRA PÁGINA
    menu.querySelectorAll("a").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            cerrarMenu();
        });
    });

    // EVITAR QUE SE ABRAN DOS CATEGORÍAS PRINCIPALES A LA VEZ
    const gruposPrincipales = menu.querySelectorAll(
        ":scope > .menu-enlaces > .grupo-menu"
    );

    gruposPrincipales.forEach((grupo) => {
        grupo.addEventListener("toggle", () => {

            if (!grupo.open) return;

            gruposPrincipales.forEach((otroGrupo) => {
                if (otroGrupo !== grupo) {
                    otroGrupo.open = false;
                }
            });

        });
    });

    // EVITAR QUE SE ABRAN DOS SUBCATEGORÍAS A LA VEZ
    const subgrupos = menu.querySelectorAll(".grupo-submenu");

    subgrupos.forEach((subgrupo) => {
        subgrupo.addEventListener("toggle", () => {

            if (!subgrupo.open) return;

            const contenedor = subgrupo.parentElement;

            contenedor.querySelectorAll(".grupo-submenu").forEach((otro) => {
                if (otro !== subgrupo) {
                    otro.open = false;
                }
            });

        });
    });

});
