const botonMenu = document.querySelector('.boton-menu');
const menuPrincipal = document.querySelector('#menu-principal');
const enlacesMenu = document.querySelectorAll('#menu-principal a');
const elementosRevelar = document.querySelectorAll('.seccion-revelar');
const anio = document.querySelector('#anio');

if (anio) {
    anio.textContent = new Date().getFullYear();
}

if (botonMenu && menuPrincipal) {
    botonMenu.addEventListener('click', () => {
        const abierto = botonMenu.getAttribute('aria-expanded') === 'true';
        botonMenu.setAttribute('aria-expanded', String(!abierto));
        botonMenu.setAttribute('aria-label', abierto ? 'Abrir menú' : 'Cerrar menú');
        menuPrincipal.classList.toggle('menu-visible', !abierto);
        document.body.classList.toggle('menu-abierto', !abierto);
    });

    enlacesMenu.forEach((enlace) => {
        enlace.addEventListener('click', () => {
            botonMenu.setAttribute('aria-expanded', 'false');
            botonMenu.setAttribute('aria-label', 'Abrir menú');
            menuPrincipal.classList.remove('menu-visible');
            document.body.classList.remove('menu-abierto');
        });
    });
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });

    elementosRevelar.forEach((elemento) => observador.observe(elemento));
} else {
    elementosRevelar.forEach((elemento) => elemento.classList.add('visible'));
}

window.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && botonMenu && menuPrincipal) {
        botonMenu.setAttribute('aria-expanded', 'false');
        botonMenu.setAttribute('aria-label', 'Abrir menú');
        menuPrincipal.classList.remove('menu-visible');
        document.body.classList.remove('menu-abierto');
    }
});
