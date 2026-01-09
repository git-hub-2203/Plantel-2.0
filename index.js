document.addEventListener("DOMContentLoaded", function () {
  // --- 1. INICIALIZAR ÍCONES ---
  if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();

  // --- INÍCIO DA SEÇÃO PROFESSORES (SWIPER + FILTRO) ---

  // 1. Seleciona os botões de filtro
  const filterButtons = document.querySelectorAll(".filter-btn");

  // 2. Inicializa o Carrossel Swiper
  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false, // Loop false é melhor para filtros funcionarem sem bugs
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // 3. Lógica de Filtro e Troca de Cor dos Botões
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. Gerencia a cor dos botões (active)
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      // 2. Filtra os slides
      document.querySelectorAll(".swiper-slide").forEach((slide) => {
        if (
          filterValue === "all" ||
          slide.getAttribute("data-category") === filterValue
        ) {
          slide.style.display = "flex";
        } else {
          slide.style.display = "none";
        }
      });

      // 3. REINICIA O CARROSSEL (O segredo para não ficar no canto)
      swiper.update(); // Recalcula o tamanho do swiper-wrapper
      swiper.slideTo(0); // Volta para o primeiro slide visível
    });
  });

  // --- FIM DA SEÇÃO PROFESSORES ---

  // --- 2. DARK MODE (CORRIGIDO PARA O SOL APARECER) ---
  const darkModeToggle = document.querySelector("#dark-mode-toggle");
  const body = document.body;

  if (darkModeToggle) {
    // Verifica preferência salva
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-theme");
      darkModeToggle.innerHTML = '<i data-lucide="sun"></i>';
      if (typeof lucide !== "undefined" && lucide.createIcons)
        lucide.createIcons();
    }

    darkModeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");

      if (isDark) {
        darkModeToggle.innerHTML = '<i data-lucide="sun"></i>';
        localStorage.setItem("theme", "dark");
      } else {
        darkModeToggle.innerHTML = '<i data-lucide="moon"></i>';
        localStorage.setItem("theme", "light");
      }
      if (typeof lucide !== "undefined" && lucide.createIcons)
        lucide.createIcons();
    });
  }

  // --- 3. MENU MOBILE (HAMBURGER) ---
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  const closeMobile = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
    document.body.classList.remove("menu-open");
    if (hamburger) {
      hamburger.innerHTML = '<i data-lucide="menu"></i>';
      if (typeof lucide !== "undefined" && lucide.createIcons)
        lucide.createIcons();
    }
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      const isOpen = mobileMenu.classList.contains("open");
      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.body.classList.add("menu-open");
        hamburger.innerHTML = '<i data-lucide="x"></i>';
      } else {
        document.body.style.overflow = "";
        document.body.classList.remove("menu-open");
        hamburger.innerHTML = '<i data-lucide="menu"></i>';
      }
      if (typeof lucide !== "undefined" && lucide.createIcons)
        lucide.createIcons();
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobile();
    });
  });

  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) closeMobile();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobile();
  });

  // --- 4. SMOOTH SCROLL (SEU ORIGINAL) ---
  document.querySelectorAll(".menu a, .mobile-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("href");
      const section = document.querySelector(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // --- 5. ANIMAÇÃO DE ENTRADA (SEU ORIGINAL) ---
  const observerOptions = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".secao").forEach((secao) => {
    observer.observe(secao);
  });

  // --- 6. CONTADORES (SEU ORIGINAL) ---
  const startCounting = () => {
    const counters = document.querySelectorAll(".count-up");

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const updateCount = () => {
        const count = +counter.getAttribute("data-current") || 0;
        const increment = target / 80; // Velocidade da animação

        if (count < target) {
          const nextCount = count + increment;
          counter.setAttribute("data-current", nextCount);

          // Lógica para formatar 1300 -> 1.3k
          let displayValue = Math.ceil(nextCount);
          if (displayValue >= 1000) {
            displayValue = (displayValue / 1000).toFixed(1) + "k";
          }

          counter.innerText = displayValue;
          setTimeout(updateCount, 25);
        } else {
          // Valor final formatado
          let finalValue = target;
          if (target >= 1000) {
            finalValue = (target / 1000).toFixed(1) + "k";
          }
          counter.innerText = finalValue;
        }
      };
      updateCount();
    });
  };

  // --- 7. PARALLAX NO SOBRE (SEU ORIGINAL) ---
  window.addEventListener("scroll", function () {
    const parallax = document.querySelector("#sobre");
    if (parallax) {
      let offset = window.pageYOffset;
      parallax.style.backgroundPositionY = offset * 0.5 + "px";
    }
  });

  // --- 8. BOTÃO VOLTAR AO TOPO (SEU ORIGINAL) ---
  const backToTopButton = document.querySelector("#backToTop");
  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 400) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });
    backToTopButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- 9. SOCIAL FAB (mantido) ---
  const socialFab = document.querySelector(".social-fab");
  const socialToggle = document.getElementById("social-toggle");
  const socialActions = document.getElementById("social-actions");

  if (socialToggle && socialFab && socialActions) {
    socialToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const opened = socialFab.classList.toggle("open");
      socialActions.setAttribute("aria-hidden", opened ? "false" : "true");
    });

    document.addEventListener("click", (e) => {
      if (!socialFab.contains(e.target)) {
        socialFab.classList.remove("open");
        socialActions.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        socialFab.classList.remove("open");
        socialActions.setAttribute("aria-hidden", "true");
      }
    });
  }
});

// 3. Botão Voltar ao Topo (com checagem)
const backToTopButton = document.querySelector("#backToTop");
if (backToTopButton) {
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 400) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 4. Contadores (startCounting)
const startCounting = () => {
  const counters = document.querySelectorAll(".count-up");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const updateCount = () => {
      const count = +counter.innerText;
      const increment = target / 100; // Ajusta a velocidade da contagem

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 20); // Velocidade da transição
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

// Inicia a animação dos números quando a seção aparece
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    if (entries[0].isIntersecting) {
      startCounting();
      obs.disconnect();
    }
  },
  { threshold: 0.5 }
);

const targetSection = document.querySelector(".container-numbers");
if (targetSection) counterObserver.observe(targetSection);

const icon = darkModeToggleBtn.querySelector(".icon-sun");
if (icon)
  icon.classList.toggle("dark", document.body.classList.contains("dark-theme"));
