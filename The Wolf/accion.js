(() => {
  const $ = (id) => document.getElementById(id);

  const WA = "543837690627";

  const waReady = /^\d{10,15}$/.test(WA);

  const waLink = (message) =>
    `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;

  const WORKS = [
    {
      c: "Mantenimiento",
      t: "Limpieza interna de notebook",
      d: "Mantenimiento interno y revisión de componentes.",
      pending: true
    },
    {
      c: "Reparación",
      t: "Cambio de disco SSD",
      d: "Instalación de una unidad de almacenamiento.",
      pending: true
    },
    {
      c: "Software",
      t: "Instalación de Windows",
      d: "Instalación y configuración del sistema.",
      pending: true
    },
    {
      c: "Impresoras",
      t: "Mantenimiento de impresora",
      d: "Limpieza y revisión del equipo.",
      pending: true
    },
    {
      c: "Conectividad",
      t: "Configuración de Wi-Fi",
      d: "Configuración de un extensor de señal.",
      pending: true
    },
    {
      c: "Desarrollo",
      t: "Desarrollo de página web",
      d: "Una muestra de interfaces y proyectos web.",
      pending: true
    }
  ];

  let selectedCategory = "Todos";

  const categories = [
    "Todos",
    ...new Set(WORKS.map((work) => work.c))
  ];

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  function renderCategories() {
    const container = $("wchips");

    container.replaceChildren();

    categories.forEach((category) => {
      const button = createElement("button", "chip", category);

      button.type = "button";
      button.setAttribute(
        "aria-pressed",
        String(category === selectedCategory)
      );

      button.addEventListener("click", () => {
        selectedCategory = category;
        renderCategories();
        renderWorks();
      });

      container.append(button);
    });
  }

  function createMedia(work) {
    const media = createElement("div", "media");

    if (work.poster) {
      media.style.backgroundImage = `url("${work.poster}")`;
    }

    const duration = createElement(
      "span",
      "dur",
      work.pending ? "Próximamente" : (work.dur || "")
    );

    if (work.pending) {
      const pending = createElement(
        "span",
        "pend",
        "Video pendiente"
      );

      media.append(pending, duration);
      return media;
    }

    const play = createElement("button", "play");
    play.type = "button";
    play.setAttribute("aria-label", `Reproducir ${work.t}`);

    play.addEventListener("click", () => {
      let player;

      if (work.yt) {
        player = document.createElement("iframe");

        player.src =
          `https://www.youtube-nocookie.com/embed/${work.yt}` +
          "?autoplay=1&rel=0&playsinline=1";

        player.allow = "autoplay; encrypted-media; fullscreen";
        player.allowFullscreen = true;
        player.title = work.t;
      } else if (work.src) {
        player = document.createElement("video");

        player.src = work.src;
        player.controls = true;
        player.autoplay = true;
        player.playsInline = true;
        player.preload = "metadata";

        if (work.poster) player.poster = work.poster;
      } else {
        return;
      }

      media.replaceChildren(player, duration);
    });

    media.append(play, duration);

    return media;
  }

  function renderWorks() {
    const container = $("works");

    const filteredWorks = WORKS.filter(
      (work) =>
        selectedCategory === "Todos" ||
        work.c === selectedCategory
    );

    container.replaceChildren();

    $("emptyWorks").hidden = filteredWorks.length !== 0;

    filteredWorks.forEach((work) => {
      const card = createElement("article", "card reel");

      const media = createMedia(work);
      const tag = createElement("span", "tag", work.c);
      const title = createElement("h2", "", work.t);
      const description = createElement("p", "", work.d);

      const ask = createElement(
        "a",
        "btn sm",
        "Consultar por este servicio"
      );

      const message =
        `Hola THE WOLF, quiero consultar por el servicio: ${work.t}.`;

      if (waReady) {
        ask.href = waLink(message);
        ask.target = "_blank";
        ask.rel = "noopener noreferrer";
      } else {
        ask.href = "#status";

        ask.addEventListener("click", (event) => {
          event.preventDefault();

          $("status").textContent =
            "Configurá el número de WhatsApp en accion.js.";
        });
      }

      card.append(media, tag, title, description, ask);
      container.append(card);
    });
  }

  renderCategories();
  renderWorks();

  
  document.addEventListener(
    "play",
    (event) => {
      if (event.target.tagName !== "VIDEO") return;

      document.querySelectorAll(".media video").forEach((video) => {
        if (video !== event.target) video.pause();
      });
    },
    true
  );
})();