// Productos de ejemplos
const PRODUCTS = [
  { id: 1, n: "Notebook \" Ryzen 5", c: "Notebooks", p: 899000, d: "16 GB de RAM y SSD de 512 GB. Ideal para estudiar y trabajar." },
  { id: 2, n: "Notebook \" Core i3", c: "Notebooks", p: 649000, d: "8 GB de RAM y SSD de 256 GB. Liviana para llevar a todos lados." },
  { id: 3, n: "PC de escritorio Ryzen 5", c: "Computadoras", p: 780000, d: "Gabinete armado con 16 GB de RAM y SSD de 480 GB. Sin monitor." },
  { id: 4, n: "Celular", c: "Celulares", p: 420000, d: "Pantalla de 6.5 pulgadas, cámara triple y batería de 5000 mAh." },
  { id: 5, n: "SSD 480 GB", c: "Componentes", p: 38000, d: "Unidad de estado sólido SATA. Mejora la velocidad de tu equipo." },
  { id: 6, n: "Memoria RAM 8 GB DDR4", c: "Componentes", p: 29000, d: "Módulo DDR4 de 3200 MHz para notebook o PC." },
  { id: 7, n: "Teclado y mouse inalámbricos", c: "Periféricos", p: 24000, d: "Combo con receptor USB y pilas incluidas." },
  { id: 8, n: "Auriculares con micrófono", c: "Accesorios", p: 21000, d: "Conexión USB, ideal para clases virtuales y reuniones." }
];

const $ = (id) => document.getElementById(id);
const money = (n) => "$" + n.toLocaleString("es-AR");
const waReady = /^\d{10,15}$/.test(WA);
let cart = {};
let cat = "Todos";

try { cart = JSON.parse(localStorage.getItem("wolf-cart")) || {}; } catch (e) { cart = {}; }
const save = () => { try { localStorage.setItem("wolf-cart", JSON.stringify(cart)); } catch (e) {} };
const find = (id) => PRODUCTS.find((p) => p.id === id);

function openWa(text) {
  if (!waReady) { $("status").textContent = ""; window.scrollTo({ top: 0 }); return; }
  $("status").textContent = "";
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
}

function renderChips() {
  const cats = ["Todos", ...new Set(PRODUCTS.map((p) => p.c))];
  $("chips").innerHTML = cats.map((c) => `<button type="button" class="chip" aria-pressed="${c === cat}" data-c="${c}">${c}</button>`).join("");
}

function renderGrid() {
  const q = $("q").value.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => (cat === "Todos" || p.c === cat) && (p.n + " " + p.d).toLowerCase().includes(q));
  $("grid").innerHTML = list.map((p) => `
    <article class="card">
      <div class="ph">${p.c}</div>
      <h3>${p.n}</h3>
      <p class="price">${money(p.p)}</p>
      <div class="row">
        <button class="btn ghost sm" type="button" data-detail="${p.id}">Ver detalle</button>
        <button class="btn sm" type="button" data-add="${p.id}">Agregar</button>
      </div>
    </article>`).join("");
  $("empty").hidden = list.length > 0;
}

function renderCart() {
  const ids = Object.keys(cart).map(Number).filter(find);
  let total = 0, count = 0;
  $("items").innerHTML = ids.length ? ids.map((id) => {
    const p = find(id), q = cart[id];
    total += p.p * q; count += q;
    return `<div class="item"><b>${p.n}</b><span>${money(p.p * q)}</span>
      <div class="qty"><button type="button" data-dec="${id}" aria-label="Quitar uno">-</button><span>${q}</span><button type="button" data-add="${id}" aria-label="Agregar uno">+</button></div></div>`;
  }).join("") : "<p>Todavía no agregaste productos. Elegí alguno del catálogo.</p>";
  $("total").textContent = money(total);
  $("count").textContent = count;
  $("order").disabled = $("clear").disabled = !ids.length;
}

function toggleCart(open) {
  $("cart").classList.toggle("open", open);
  $("cart").setAttribute("aria-hidden", String(!open));
}

function showDetail(id) {
  const p = find(id);
  $("detail").innerHTML = `<div class="ph">${p.c}</div><h3>${p.n}</h3><p>${p.d}</p>
    <p class="price">${money(p.p)}</p>
    <div class="row"><button class="btn sm" type="button" data-add="${p.id}" data-close>Agregar al carrito</button>
    <button class="btn ghost sm" type="button" data-consult="${p.id}">Consultar</button>
    <button class="btn ghost sm" type="button" data-close>Cerrar</button></div>`;
  $("detail").showModal();
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.c) { cat = t.dataset.c; renderChips(); renderGrid(); }
  if (t.dataset.add) { const id = +t.dataset.add; cart[id] = (cart[id] || 0) + 1; save(); renderCart(); if (!t.hasAttribute("data-close")) toggleCart(true); }
  if (t.dataset.dec) { const id = +t.dataset.dec; cart[id] = (cart[id] || 1) - 1; if (cart[id] <= 0) delete cart[id]; save(); renderCart(); }
  if (t.dataset.detail) showDetail(+t.dataset.detail);
  if (t.dataset.consult) openWa("Hola THE WOLF, quiero consultar por: " + find(+t.dataset.consult).n);
  if (t.hasAttribute("data-close")) $("detail").close();
});

$("q").addEventListener("input", renderGrid);
$("openCart").addEventListener("click", () => toggleCart(true));
$("closeCart").addEventListener("click", () => toggleCart(false));
$("clear").addEventListener("click", () => { cart = {}; save(); renderCart(); });
$("order").addEventListener("click", () => {
  let total = 0;
  const lines = Object.keys(cart).map(Number).filter(find).map((id) => {
    const p = find(id); total += p.p * cart[id];
    return `- ${cart[id]} x ${p.n} (${money(p.p * cart[id])})`;
  });
  openWa("Hola THE WOLF, quiero consultar por este pedido:\n" + lines.join("\n") + "\nTotal estimado: " + money(total));
});
$("waFloat").addEventListener("click", () => openWa("Hola THE WOLF, quiero hacer una consulta."));
$("detail").addEventListener("click", (e) => { if (e.target === $("detail")) $("detail").close(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleCart(false); });

renderChips(); renderGrid(); renderCart();