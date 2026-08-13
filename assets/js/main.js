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

    const btnSubmit = document.getElementById("btn-submit");
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Enviando...";
    }
    if (note) note.textContent = "";

    const nombre = form.nombre.value.trim();
    const empresa = form.empresa.value.trim();
    const servicio = form.servicio ? form.servicio.value : "";
    const mensaje = form.mensaje.value.trim();

    const lines = [
      `Hola, soy ${nombre}${empresa ? " de " + empresa : ""}.`,
      servicio ? `Me interesa: ${servicio}.` : null,
      mensaje ? mensaje : "Quisiera más información / una cotización.",
    ].filter(Boolean);

    // URL del Google Apps Script que procesa y envía el correo
    const urlScript = 'https://script.google.com/macros/s/AKfycbwLxMCeKItmE14_Y0z5gjYfLeXocxhbgi9ZSucjYd60cjNs-_KnEGysreSn4C_-IwvUUQ/exec';

    const formData = new FormData(form);
    const urlParams = new URLSearchParams(formData).toString();

    const fullUrl = urlScript + '?' + urlParams;
    console.log('Contact form: POST', fullUrl);

    fetch(fullUrl, { method: 'POST' })
      .then(response => {
        console.log('Contact form: response status', response.status, response.statusText);
        const ct = response.headers.get('content-type') || '';
        if (!response.ok) {
          // Try to read body for diagnostics
          return response.text().then(text => { throw new Error(`HTTP ${response.status}: ${text || response.statusText}`); });
        }
        if (ct.indexOf('application/json') !== -1) return response.json();
        return response.text().then(text => {
          try { return JSON.parse(text); } catch (e) { return { raw: text }; }
        });
      })
      .then(data => {
        console.log('Contact form: parsed response', data);
        if (data && data.result === 'success') {
          if (note) {
            note.style.color = 'green';
            note.textContent = '¡Gracias! Tu mensaje ha sido enviado con éxito y guardado.';
          }
          form.reset();

          // Abrir WhatsApp solo después de envío exitoso si está habilitado
          if (form.dataset.useWhatsapp === "true") {
            const text = encodeURIComponent(lines.join(" "));
            window.open(`https://wa.me/${LCL_WHATSAPP_NUMBER}?text=${text}`, "_blank");
          }
        } else {
          if (note) {
            note.style.color = 'red';
            note.textContent = 'Hubo un problema en el servidor. Inténtalo de nuevo.';
          }
          console.error('Contact form: server returned error', data);
        }
      })
      .catch(error => {
        console.error('Contact form: fetch error', error);

        // Algunos despliegues de Google Apps Script responden pero el navegador
        // bloquea la respuesta por CORS y lanza "Failed to fetch" aunque el
        // script se haya ejecutado correctamente. Hacemos un fallback:
        // - Abrir WhatsApp si está habilitado
        // - Mostrar nota indicando que el envío pudo haberse realizado
        if (form.dataset.useWhatsapp === "true") {
          const text = encodeURIComponent(lines.join(" "));
          window.open(`https://wa.me/${LCL_WHATSAPP_NUMBER}?text=${text}`, "_blank");
        }

        if (note) {
          note.style.color = 'orange';
          note.textContent = 'Enviado (no se pudo verificar la respuesta del servidor). Si no recibes confirmación, revisa los logs del Web App.';
        }
      })
      .finally(() => {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Enviar Mensaje';
        }
      });
  });
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
