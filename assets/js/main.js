// LCL Soluciones landing — nav toggle, scroll reveal, contact form (WhatsApp)

const LCL_WHATSAPP_NUMBER = "526692541294"; // +52 669 254 1294
const LCL_CONTACT_EMAIL = "ventas@lclsoluciones.com";

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollReveal();
  initContactForm();
  initYear();
});

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = form.nombre.value.trim();
    const empresa = form.empresa.value.trim();
    const servicio = form.servicio ? form.servicio.value : "";
    const mensaje = form.mensaje.value.trim();

    const lines = [
      `Hola, soy ${nombre}${empresa ? " de " + empresa : ""}.`,
      servicio ? `Me interesa: ${servicio}.` : null,
      mensaje ? mensaje : "Quisiera más información / una cotización.",
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join(" "));
    window.open(`https://wa.me/${LCL_WHATSAPP_NUMBER}?text=${text}`, "_blank");

    if (note) {
      note.textContent = "Se abrió WhatsApp con tu mensaje listo para enviar.";
    }
  });
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
