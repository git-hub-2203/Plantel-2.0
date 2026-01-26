// Adiciona classe para habilitar funcionalidades JS
document.documentElement.classList.add("js-enabled");

// ======================================================
// VARIÁVEIS GLOBAIS
// ======================================================
let swiper;

// ======================================================
// FUNÇÕES GLOBAIS
// ======================================================
const initLucideIcons = () => {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
};

const initSwiper = () => {
  if (typeof Swiper !== "undefined") {
    const swiperContainer = document.querySelector(".mySwiper");
    if (!swiperContainer) return;

    swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
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
  }
};

// ======================================================
// DOM CONTENT LOADED
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     1. INICIALIZAÇÃO DOS ÍCONES (LUCIDE)
  ====================================================== */
  initLucideIcons();

  /* ======================================================
     2. FAQ ACCORDION
  ====================================================== */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach((i) => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });

  /* ======================================================
     3. SWIPER + FILTROS
  ====================================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (filterButtons.length > 0) {
    initSwiper();

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");

        document.querySelectorAll(".swiper-slide").forEach((slide) => {
          const category = slide.getAttribute("data-category");
          slide.style.display =
            filterValue === "all" || category === filterValue ? "flex" : "none";
        });

        if (swiper) {
          setTimeout(() => {
            swiper.update();
            swiper.slideTo(0);
          }, 50);
        }
      });
    });
  }

  /* ======================================================
     4. DARK MODE
  ====================================================== */
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  if (darkModeToggle) {
    const applyDarkMode = () => {
      if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-theme");
        darkModeToggle.innerHTML = '<i data-lucide="sun"></i>';
        initLucideIcons();
      }
    };

    applyDarkMode();

    darkModeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");

      darkModeToggle.innerHTML = isDark
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';

      localStorage.setItem("theme", isDark ? "dark" : "light");
      initLucideIcons();
    });
  }

  /* ======================================================
     5. MENU MOBILE
  ====================================================== */
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
      initLucideIcons();
    }
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      document.body.style.overflow = isOpen ? "hidden" : "";
      document.body.classList.toggle("menu-open", isOpen);
      hamburger.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
      initLucideIcons();
    });
  }

  mobileLinks.forEach((link) => link.addEventListener("click", closeMobile));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobile();
  });

  /* ======================================================
     6. SCROLL SUAVE
  ====================================================== */
  const smoothScrollLinks = document.querySelectorAll(
    ".menu a, .mobile-link, .btn-saiba-mais, .bottom-nav a"
  );
  smoothScrollLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("href");
      if (!target || !target.startsWith("#")) return;

      const section = document.querySelector(target);
      if (!section) return;

      e.preventDefault();
      const headerHeight = document.querySelector("header")?.offsetHeight || 80;
      window.scrollTo({
        top: section.offsetTop - headerHeight,
        behavior: "smooth",
      });

      // Fecha menu mobile se estiver aberto
      if (mobileMenu && mobileMenu.classList.contains("open")) {
        closeMobile();
      }
    });
  });

  /* ======================================================
     7. CONTADORES ANIMADOS (COM EFEITO VISUAL) - CORRIGIDO
  ====================================================== */
  const animateCounters = () => {
    const counters = document.querySelectorAll(".numbers-text");
    const duration = 2000; // 2 segundos

    counters.forEach((counter) => {
      const targetText =
        counter.getAttribute("data-target") || counter.textContent;
      const target = parseInt(targetText.replace(/[^\d]/g, ""));
      const hasSuffix = targetText.includes("+") || targetText.includes("k");

      if (counter.classList.contains("animated")) return;

      counter.classList.add("animating");
      const start = 0;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        let displayValue =
          target >= 1000
            ? (current / 1000).toFixed(1).replace(".0", "") + "k"
            : current.toLocaleString();

        if (hasSuffix && targetText.includes("+")) {
          displayValue += "+";
        }

        // Atualiza apenas o span .count-up se existir
        const countUpSpan = counter.querySelector(".count-up");
        if (countUpSpan) {
          countUpSpan.textContent = displayValue.replace(/[^\d.k+]/g, "");
        } else {
          counter.textContent = displayValue;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          let finalValue =
            target >= 1000
              ? (target / 1000).toFixed(1).replace(".0", "") + "k"
              : target.toLocaleString();

          if (hasSuffix && targetText.includes("+")) {
            finalValue += "+";
          }

          if (countUpSpan) {
            countUpSpan.textContent = finalValue.replace(/[^\d.k+]/g, "");
          } else {
            counter.textContent = finalValue;
          }
          counter.classList.remove("animating");
          counter.classList.add("animated");
        }
      };

      requestAnimationFrame(update);
    });
  };

  // Observer para ativar contadores quando visíveis
  const counterSection = document.querySelector(".container-numbers");
  if (counterSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(counterSection);
  }

  /* ======================================================
     8. PARALLAX (APENAS PARA #sobre)
  ====================================================== */
  const sobre = document.getElementById("sobre");
  if (sobre) {
    const updateParallax = () => {
      if (window.innerWidth >= 1024) {
        sobre.style.backgroundPositionY = window.pageYOffset * 0.5 + "px";
      }
    };

    // Só ativa parallax em desktop
    if (window.innerWidth >= 1024) {
      window.addEventListener("scroll", updateParallax);
      updateParallax();
    }
  }

  /* ======================================================
     9. BOTÃO VOLTAR AO TOPO
  ====================================================== */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("show", window.pageYOffset > 400);
    };

    window.addEventListener("scroll", updateBackToTop);

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Inicializa
    updateBackToTop();
  }

  /* ======================================================
     10. SOCIAL FAB (MOBILE)
  ====================================================== */
  const socialFab = document.querySelector(".social-fab");
  const socialToggle = document.getElementById("social-toggle");
  const socialActions = document.getElementById("social-actions");

  if (socialFab && socialToggle && socialActions) {
    socialToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = socialFab.classList.toggle("open");
      socialActions.setAttribute("aria-hidden", !open);
      socialToggle.setAttribute("aria-expanded", open);
    });

    document.addEventListener("click", (e) => {
      if (!socialFab.contains(e.target)) {
        socialFab.classList.remove("open");
        socialActions.setAttribute("aria-hidden", "true");
        socialToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ======================================================
     11. NAVBAR LATERAL SCROLL
  ====================================================== */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const handleNavbarScroll = () => {
      if (window.pageYOffset > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleNavbarScroll);
    handleNavbarScroll();
  }

  /* ======================================================
     12. ANIMAÇÃO DOS CARDS DE COMUNIDADES (STAGGER EFFECT)
  ====================================================== */
  const communityCards = document.querySelectorAll(".box-comunidade");

  if (communityCards.length > 0) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Delay progressivo para efeito cascata
            setTimeout(() => {
              entry.target.classList.add("visible");
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 100);

            // Para de observar após animar
            cardObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    communityCards.forEach((card) => {
      // Inicializa estilo apenas se não tiver
      if (!card.style.opacity) {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)";
      }
      cardObserver.observe(card);
    });
  }

  /* ======================================================
     13. PREVENÇÃO DE CLIQUE MÚLTIPLO
  ====================================================== */
  document
    .querySelectorAll("a[href^='#'], button[type='button']")
    .forEach((element) => {
      element.addEventListener("click", function (e) {
        if (this.classList.contains("disabled")) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // Adiciona delay para evitar múltiplos cliques
        this.classList.add("disabled");
        setTimeout(() => {
          this.classList.remove("disabled");
        }, 1000);
      });
    });

  /* ======================================================
     14. REDIMENSIONAMENTO DA JANELA
  ====================================================== */
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Atualiza Swiper quando a janela é redimensionada
      if (swiper && swiper.update) {
        swiper.update();
      }

      // Re-aplica parallax se necessário
      const sobre = document.getElementById("sobre");
      if (sobre && window.innerWidth >= 1024) {
        sobre.style.backgroundPositionY = window.pageYOffset * 0.5 + "px";
      }
    }, 250);
  });

  /* ======================================================
     15. BOTTOM NAV HIGHLIGHT (se implementado)
  ====================================================== */
  const bottomNavItems = document.querySelectorAll(".bottom-nav .nav-item");
  const sections = document.querySelectorAll("section[id]");

  if (bottomNavItems.length > 0) {
    const highlightBottomNav = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight =
          document.querySelector("header")?.offsetHeight || 80;

        if (scrollY >= sectionTop - headerHeight - 100) {
          current = section.getAttribute("id");
        }
      });

      bottomNavItems.forEach((item) => {
        item.classList.remove("active");
        const href = item.getAttribute("href");
        if (href === `#${current}`) {
          item.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", highlightBottomNav);
    highlightBottomNav();
  }
});

// ======================================================
// WINDOW LOAD
// ======================================================
window.addEventListener("load", () => {
  // Remove o preloader se existir
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }

  // Atualiza Swiper após todas as imagens carregarem
  if (typeof swiper !== "undefined" && swiper.update) {
    setTimeout(() => {
      swiper.update();
    }, 300);
  }

  // Verifica swiper mobile
  checkMobileSwiper();
});

// ======================================================
// SWIPER RESPONSIVO PARA MOBILE
// ======================================================
const checkMobileSwiper = () => {
  const swiperContainer = document.querySelector(".mySwiper");
  if (!swiperContainer) return;

  const isMobile = window.innerWidth <= 768;
  const swiperWrapper = swiperContainer.querySelector(".swiper-wrapper");

  if (isMobile) {
    // Desativa swiper no mobile
    if (swiper && swiper.destroy) {
      try {
        swiper.destroy(true, true);
      } catch (e) {
        console.log("Swiper já destruído ou não inicializado");
      }
    }

    // Adiciona grid
    if (swiperWrapper) {
      swiperWrapper.style.display = "grid";
      swiperWrapper.style.gridTemplateColumns = "1fr";
      swiperWrapper.style.gap = "25px";
      swiperWrapper.style.transform = "none !important";

      // Mostra todas as slides
      document.querySelectorAll(".swiper-slide").forEach((slide) => {
        slide.style.width = "100%";
        slide.style.opacity = "1";
        slide.style.transform = "none";
      });
    }
  } else {
    // Reativa swiper no desktop apenas se não estiver inicializado
    if (!swiper || !swiper.initialized) {
      initSwiper();
    }

    // Remove estilo de grid
    if (swiperWrapper) {
      swiperWrapper.style.display = "";
      swiperWrapper.style.gridTemplateColumns = "";
      swiperWrapper.style.gap = "";
    }
  }
};

// Verifica no redimensionamento
window.addEventListener("resize", () => {
  setTimeout(checkMobileSwiper, 150);
});
