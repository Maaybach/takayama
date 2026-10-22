
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const state = {
    mode: "rp",
    time: "onetime",
    sky: "natural",
    clouds: 65,
    shooting: true,
    trails: false,
    fog: false
  };

  const skySettings = {
    natural: {
      label: "NATUREL",
      title: "Sakura Horizon",
      background: "linear-gradient(180deg, #9b7caa 0%, #d7a0bc 48%, #573353 100%)",
      sun: "#ffd6e7",
      mountainBack: "#75456e",
      mountainFront: "#27172f",
      glow: "rgba(255,214,231,.28)"
    },
    blue: {
      label: "BLEU",
      title: "Yoru Mirage",
      background: "linear-gradient(180deg, #152d61 0%, #397fc0 48%, #15253f 100%)",
      sun: "#b4efff",
      mountainBack: "#345b9d",
      mountainFront: "#131b35",
      glow: "rgba(121,232,242,.3)"
    },
    pink: {
      label: "ROSE",
      title: "Sakura Dream",
      background: "linear-gradient(180deg, #6e345e 0%, #e87eb2 52%, #4b203e 100%)",
      sun: "#ffe0ef",
      mountainBack: "#a54883",
      mountainFront: "#2b142b",
      glow: "rgba(255,117,189,.3)"
    },
    purple: {
      label: "VIOLET",
      title: "Violet Eclipse",
      background: "linear-gradient(180deg, #2b205d 0%, #8154ba 48%, #241632 100%)",
      sun: "#e4c6ff",
      mountainBack: "#60418b",
      mountainFront: "#1b112b",
      glow: "rgba(196,160,255,.3)"
    },
    orange: {
      label: "ORANGE",
      title: "Akane Sunset",
      background: "linear-gradient(180deg, #633b54 0%, #ed956d 48%, #382039 100%)",
      sun: "#ffe0a6",
      mountainBack: "#a85b54",
      mountainFront: "#2b1729",
      glow: "rgba(255,174,111,.3)"
    },
    red: {
      label: "ROUGE",
      title: "Crimson Oni",
      background: "linear-gradient(180deg, #351528 0%, #b93751 48%, #24101f 100%)",
      sun: "#ffb1b5",
      mountainBack: "#862e48",
      mountainFront: "#1c101d",
      glow: "rgba(255,92,103,.3)"
    }
  };

  const scene = $("#preview-scene");
  const previewSun = $(".preview-sun");
  const mountainBack = $(".mountain-back");
  const mountainFront = $(".mountain-front");
  const previewTitle = $("#preview-title");
  const previewMode = $("#preview-mode");
  const previewTime = $("#preview-time");
  const previewColor = $("#preview-color");
  const previewClouds = $("#preview-clouds");
  const cloudRange = $("#cloud-range");
  const cloudValue = $("#cloud-value");
  const shootingToggle = $("#shooting-toggle");
  const trailsToggle = $("#trails-toggle");
  const fogToggle = $("#fog-toggle");
  const toast = $("#interaction-toast");

  let toastTimer;
  let scrollTicking = false;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2400);
  }

  function updatePreviewTitle() {
    if (!previewTitle) return;

    if (state.mode === "gunfight") {
      previewTitle.textContent =
        state.sky === "red" ? "Crimson Oni" : "Combat Horizon";
    } else {
      previewTitle.textContent = skySettings[state.sky].title;
    }
  }

  function setMode(mode, notify = true) {
    state.mode = mode === "gunfight" ? "gunfight" : "rp";

    $$("[data-mode]").forEach(button => {
      const selected = button.dataset.mode === state.mode;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    if (previewMode) {
      previewMode.textContent =
        state.mode === "rp" ? "ROLEPLAY" : "GUNFIGHT";
    }

    updatePreviewTitle();

    if (notify) {
      showToast(
        state.mode === "rp"
          ? "Univers Roleplay sélectionné."
          : "Univers Gunfight sélectionné."
      );
    }
  }

  function setTime(time, notify = true) {
    state.time = time === "alltime" ? "alltime" : "onetime";

    $$("[data-time]").forEach(button => {
      const selected = button.dataset.time === state.time;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    if (previewTime) {
      previewTime.textContent =
        state.time === "alltime" ? "ALL TIME" : "ONE TIME";
    }

    if (notify) {
      showToast(
        state.time === "alltime"
          ? "Cycle All Time sélectionné."
          : "Cycle One Time sélectionné."
      );
    }
  }

  function setSky(sky, notify = true) {
    if (!Object.prototype.hasOwnProperty.call(skySettings, sky)) return;

    state.sky = sky;
    const settings = skySettings[sky];

    $$("[data-sky]").forEach(button => {
      const selected = button.dataset.sky === sky;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    if (scene) {
      scene.style.background = settings.background;
      scene.style.setProperty("--preview-sky-glow", settings.glow);
    }

    if (previewSun) {
      previewSun.style.background = settings.sun;
      previewSun.style.boxShadow = `0 0 50px ${settings.glow}`;
    }

    if (mountainBack) {
      mountainBack.style.background = settings.mountainBack;
    }

    if (mountainFront) {
      mountainFront.style.background = settings.mountainFront;
    }

    if (previewColor) previewColor.textContent = settings.label;

    updatePreviewTitle();

    const card = $("#preview-card");
    if (card) {
      card.style.borderColor =
        sky === "blue"
          ? "rgba(121,232,242,.45)"
          : sky === "red"
            ? "rgba(255,92,103,.5)"
            : sky === "purple"
              ? "rgba(196,160,255,.45)"
              : sky === "orange"
                ? "rgba(255,174,111,.45)"
                : "rgba(255,117,189,.35)";
    }

    if (notify) {
      showToast(`Couleur du ciel : ${settings.label.toLowerCase()}.`);
    }
  }

  function setClouds(value, notify = false) {
    const parsed = Number(value);
    state.clouds = Math.max(
      0,
      Math.min(100, Number.isFinite(parsed) ? parsed : 65)
    );

    if (cloudRange) cloudRange.value = String(state.clouds);
    if (cloudValue) cloudValue.textContent = `${state.clouds}%`;
    if (previewClouds) previewClouds.textContent = `${state.clouds}%`;

    $$(".preview-cloud").forEach(cloud => {
      cloud.style.opacity = String(state.clouds / 100);
      cloud.style.transform = `scale(${0.6 + state.clouds / 250})`;
    });

    if (notify) {
      showToast(`Intensité des nuages : ${state.clouds}%.`);
    }
  }

  function setEffects() {
    state.shooting = Boolean(shootingToggle?.checked);
    state.trails = Boolean(trailsToggle?.checked);
    state.fog = Boolean(fogToggle?.checked);

    $$(".preview-star").forEach(star => {
      star.style.display = state.shooting ? "" : "none";
    });

    if (scene) {
      scene.classList.toggle("has-trails", state.trails);
      scene.classList.toggle("has-fog", state.fog);
      scene.classList.toggle("has-shooting-stars", state.shooting);
    }
  }

  $$("[data-mode]").forEach(button => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  $$("[data-time]").forEach(button => {
    button.addEventListener("click", () => setTime(button.dataset.time));
  });

  $$("[data-sky]").forEach(button => {
    button.addEventListener("click", () => setSky(button.dataset.sky));
  });

  if (cloudRange) {
    cloudRange.addEventListener("input", () => {
      setClouds(cloudRange.value);
    });

    cloudRange.addEventListener("change", () => {
      setClouds(cloudRange.value, true);
    });
  }

  [shootingToggle, trailsToggle, fogToggle].forEach(toggle => {
    toggle?.addEventListener("change", setEffects);
  });

  function applyPreset(sky) {
    if (!Object.prototype.hasOwnProperty.call(skySettings, sky)) return;

    setSky(sky, false);
    setMode(sky === "red" ? "gunfight" : "rp", false);

    const studio = $("#studio");
    if (studio) {
      studio.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    showToast(`${skySettings[sky].title} chargé dans le studio.`);
  }

  $$(".signature-card[data-preset]").forEach(card => {
    card.style.cursor = "pointer";

    if (!card.hasAttribute("tabindex")) {
      card.setAttribute("tabindex", "0");
    }

    if (!card.hasAttribute("role")) {
      card.setAttribute("role", "button");
    }

    const activate = () => applyPreset(card.dataset.preset);

    card.addEventListener("click", activate);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  const menuToggle = $(".menu-toggle");
  const nav = $(".desktop-nav");

  function closeMenu() {
    nav?.classList.remove("menu-visible");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    nav?.classList.toggle("menu-visible", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  $$(".desktop-nav a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  function updateScrollUI() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    const progressFill = $("#page-progress-fill");
    if (progressFill) {
      progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }

    const sections = $$("main section[id]");
    let currentId = "top";

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 160) {
        currentId = section.id;
      }
    });

    $$(".desktop-nav a").forEach(link => {
      const target = link.getAttribute("href");
      link.classList.toggle(
        "active",
        target === `#${currentId}` ||
          (currentId === "top" && target === "#top")
      );
    });

    scrollTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
    updateScrollUI();
  });

  // Les animations restent facultatives : le contenu ne doit jamais
  // rester invisible si IntersectionObserver n'est pas disponible.
  const revealTargets = [
    ".section-heading",
    ".mode-card",
    ".option-panel",
    ".preview-card",
    ".preview-tip",
    ".signature-card",
    ".process-card",
    ".manifesto-content"
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealTargets.forEach(selector => {
      $$(selector).forEach(element => {
        element.classList.add("reveal-ready");
        observer.observe(element);
      });
    });

    // Sécurise les éléments déjà visibles au chargement.
    requestAnimationFrame(() => {
      revealTargets.forEach(selector => {
        $$(selector).forEach(element => {
          if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add("revealed");
          }
        });
      });
    });
  } else {
    revealTargets.forEach(selector => {
      $$(selector).forEach(element => {
        element.classList.remove("reveal-ready");
        element.classList.add("revealed");
      });
    });
  }

  setMode(state.mode, false);
  setTime(state.time, false);
  setSky(state.sky, false);
  setClouds(state.clouds);
  setEffects();
  updateScrollUI();
});
