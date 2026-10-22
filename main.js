const SERVICES = [
  { t: "Mantenimiento y limpieza", d: "Cuidado preventivo para que tus equipos rindan mejor y duren más.",
    l: ["Limpieza de PC y notebooks", "Limpieza interna mediante desarme, cuando corresponda", "Limpieza y mantenimiento de impresoras", "Revisión general de equipos"] },
  { t: "Reparación y mejoras", d: "Diagnóstico de fallas y mejoras para equipos que andan lentos o con problemas.",
    l: ["Cambio e instalación de discos SSD y HDD", "Instalación de drivers", "Instalación y configuración de periféricos", "Diagnóstico de problemas informáticos"] },
  { t: "Software y configuración", d: "Dejamos tu equipo listo para usar y libre de errores.",
    l: ["Instalación y activación de Windows y Office con licencias válidas", "Instalación y configuración de programas", "Solución de errores de software", "Revisión y eliminación de malware", "Configuración de extensores de Wi-Fi"] },
  { t: "Asistencia para celulares", d: "Ayuda con el software y la configuración de tu celular.",
    l: ["Diagnóstico de problemas de software", "Configuración de dispositivos", "Solución de errores y problemas de funcionamiento dentro de nuestras capacidades"] },
  { t: "Desarrollo de software", d: "Herramientas digitales hechas a medida de tu necesidad.",
    l: ["Diseño y creación de páginas web", "Desarrollo de programas locales", "Soluciones digitales personalizadas para personas, comercios y pequeños emprendimientos"] }
];

// aca van los proyectos 
const PROJECTS = [
  { t: "Página web de THE WOLF", d: "Sitio de presentación del emprendimiento, desarrollado con HTML, CSS y JavaScript.", tag: "Proyecto académico" },
  { t: "Juego de memoria", d: "Pagina web de juegos creada para la materia legizlacion.", tag: "Proyecto académico", img: "proyectos/juegodememoria.png" },
  { t: "Programa Local", d: "Un programa local para la municipalidad en base a el parque automotor.", tag: "Proyecto Personal", img: "proyectos/trabajo parque automotor.png" }
];

const $ = (id) => document.getElementById(id);
const waReady = /^\d{10,15}$/.test(WA);
const waLink = (text) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

// Servicios
SERVICES.forEach((s) => {
  const card = el("article", "card");
  card.append(el("h3", "", s.t), el("p", "", s.d));
  const ul = el("ul");
  s.l.forEach((i) => ul.append(el("li", "", i)));
  const btn = el("a", "btn sm", "Consultar por WhatsApp");
  btn.href = "#contacto";
  btn.dataset.wa = "Hola THE WOLF, quiero consultar por: " + s.t + ".";
  btn.target = "_blank";
  btn.rel = "noopener";
  card.append(ul, btn);
  $("services").append(card);
  const opt = el("option", "", s.t);
  $("ctype").append(opt);
});

// Proyectos
PROJECTS.forEach((p) => {
  const card = el("article", "card");
  if (p.img) { const im = el("img"); im.src = p.img; im.alt = p.t; im.loading = "lazy"; im.style.width = "100%"; card.append(im); }
  else card.append(el("div", "ph", "Espacio para captura"));
  card.append(el("span", "tag", p.tag), el("h3", "", p.t), el("p", "", p.d));
  $("projects").append(card);
});

// Botones de WhatsApp
document.querySelectorAll("[data-wa]").forEach((a) => {
  if (waReady) a.href = waLink(a.dataset.wa);
  else a.addEventListener("click", (e) => {
    a.removeAttribute("target");
    $("status").textContent = "Falta configurar el número de WhatsApp en js/config.js (constante WA).";
  });
});

// Formulario
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("cname"), msg = $("cmsg");
  const nameOk = name.value.trim().length >= 2;
  const msgOk = msg.value.trim().length >= 10;
  name.setAttribute("aria-invalid", !nameOk);
  msg.setAttribute("aria-invalid", !msgOk);
  if (!nameOk) { $("status").textContent = "Escribí tu nombre (mínimo 2 letras)."; name.focus(); return; }
  if (!msgOk) { $("status").textContent = "Contanos tu consulta con al menos 10 caracteres."; msg.focus(); return; }
  if (!waReady) { $("status").textContent = "Falta configurar el número de WhatsApp en js/config.js (constante WA)."; return; }
  $("status").textContent = "";
  const text = "Hola THE WOLF, soy " + name.value.trim() + ".\nConsulta sobre: " + $("ctype").value + ".\n" + msg.value.trim();
  window.open(waLink(text), "_blank", "noopener");
});

// Menu
const links = document.querySelectorAll("nav a");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle("on", l.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section").forEach((s) => io.observe(s));
}

// Menu de desplegable
const burger = $("burger"), menu = $("menu");
function setMenu(open) { menu.hidden = !open; burger.setAttribute("aria-expanded", String(open)); }
burger.addEventListener("click", (e) => { e.stopPropagation(); setMenu(menu.hidden); });
document.addEventListener("click", (e) => { if (!menu.contains(e.target)) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });