/* ======================================================
   PLANTEL - index.js (OTIMIZADO COM TRATAMENTO DE ERROS)
   - Mantém 100% da funcionalidade original
   - Adiciona try-catch em todas operações
   - Sistema de logs para debug
   - Fallbacks quando bibliotecas não carregam
====================================================== */

// Adiciona classe para habilitar funcionalidades JS
document.documentElement.classList.add("js-enabled");
document.body.classList.add("js");

// ======================================================
// SISTEMA DE LOGS (PODE SER DESATIVADO EM PRODUÇÃO)
// ======================================================
const DEBUG = true; // Mude para false em produção

const Logger = {
  info: (msg, data = "") => DEBUG && console.log(`ℹ️ ${msg}`, data),
  warn: (msg, data = "") => console.warn(`⚠️ ${msg}`, data),
  error: (msg, err = "") => console.error(`❌ ${msg}`, err),
  success: (msg, data = "") => DEBUG && console.log(`✅ ${msg}`, data),
};

// ======================================================
// VARIÁVEIS GLOBAIS
// ======================================================
let swiper;

// ======================================================
// FUNÇÕES AUXILIARES COM TRATAMENTO DE ERROS
// ======================================================
const safeQuerySelector = (selector, context = document) => {
  try {
    const element = context.querySelector(selector);
    if (!element) Logger.warn(`Elemento não encontrado: ${selector}`);
    return element;
  } catch (error) {
    Logger.error(`Erro ao buscar elemento: ${selector}`, error);
    return null;
  }
};

const safeQuerySelectorAll = (selector, context = document) => {
  try {
    return context.querySelectorAll(selector);
  } catch (error) {
    Logger.error(`Erro ao buscar elementos: ${selector}`, error);
    return [];
  }
};

// ======================================================
// INICIALIZAÇÃO DE ÍCONES LUCIDE
// ======================================================
const initLucideIcons = () => {
  try {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
      Logger.success("Ícones Lucide inicializados");
    } else {
      Logger.warn("Biblioteca Lucide não encontrada - continuando sem ícones");
    }
  } catch (error) {
    Logger.error("Erro ao inicializar Lucide", error);
  }
};

// ======================================================
// INICIALIZAÇÃO DO SWIPER
// ======================================================
const initSwiper = () => {
  try {
    if (typeof Swiper === "undefined") {
      Logger.warn("Biblioteca Swiper não encontrada");
      return null;
    }

    const swiperContainer = safeQuerySelector(".mySwiper");
    if (!swiperContainer) {
      Logger.info("Container .mySwiper não encontrado");
      return null;
    }

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

    Logger.success("Swiper inicializado");
    return swiper;
  } catch (error) {
    Logger.error("Erro ao inicializar Swiper", error);
    return null;
  }
};

// ======================================================
// DOM CONTENT LOADED
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  Logger.info("🚀 Inicializando aplicação Plantel");

  /* ======================================================
     1. INICIALIZAÇÃO DOS ÍCONES (LUCIDE)
  ====================================================== */
  initLucideIcons();

  /* ======================================================
     2. FAQ ACCORDION
  ====================================================== */
  try {
    const faqItems = safeQuerySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = safeQuerySelector(".faq-question", item);
      if (!question) return;

      question.addEventListener("click", () => {
        try {
          const isActive = item.classList.contains("active");
          faqItems.forEach((i) => i.classList.remove("active"));
          if (!isActive) item.classList.add("active");
          Logger.info("FAQ toggled");
        } catch (error) {
          Logger.error("Erro ao alternar FAQ", error);
        }
      });
    });
    if (faqItems.length > 0)
      Logger.success(`${faqItems.length} FAQ items inicializados`);
  } catch (error) {
    Logger.error("Erro ao inicializar FAQ", error);
  }

  /* ======================================================
     3. SWIPER + FILTROS
  ====================================================== */
  try {
    const filterButtons = safeQuerySelectorAll(".filter-btn");
    if (filterButtons.length > 0) {
      initSwiper();

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          try {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");
            Logger.info(`Filtro aplicado: ${filterValue}`);

            safeQuerySelectorAll(".swiper-slide").forEach((slide) => {
              const category = slide.getAttribute("data-category");
              slide.style.display =
                filterValue === "all" || category === filterValue
                  ? "flex"
                  : "none";
            });

            if (swiper) {
              setTimeout(() => {
                swiper.update();
                swiper.slideTo(0);
              }, 50);
            }
          } catch (error) {
            Logger.error("Erro ao aplicar filtro", error);
          }
        });
      });
      Logger.success(`${filterButtons.length} filtros inicializados`);
    }
  } catch (error) {
    Logger.error("Erro ao inicializar filtros", error);
  }

  /* ======================================================
     4. DARK MODE
  ====================================================== */
  try {
    const darkModeToggle = safeQuerySelector("#dark-mode-toggle");
    const body = document.body;

    if (darkModeToggle) {
      const applyDarkMode = () => {
        try {
          if (localStorage.getItem("theme") === "dark") {
            body.classList.add("dark-theme");
            darkModeToggle.innerHTML = '<i data-lucide="sun"></i>';
            initLucideIcons();
          }
        } catch (error) {
          Logger.error("Erro ao aplicar dark mode", error);
        }
      };

      applyDarkMode();

      darkModeToggle.addEventListener("click", () => {
        try {
          body.classList.toggle("dark-theme");
          const isDark = body.classList.contains("dark-theme");

          darkModeToggle.innerHTML = isDark
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';

          localStorage.setItem("theme", isDark ? "dark" : "light");
          initLucideIcons();
          Logger.info(`Tema alterado para: ${isDark ? "escuro" : "claro"}`);
        } catch (error) {
          Logger.error("Erro ao alternar dark mode", error);
        }
      });

      Logger.success("Dark mode inicializado");
    }
  } catch (error) {
    Logger.error("Erro ao inicializar dark mode", error);
  }

  /* ======================================================
     5. MENU MOBILE
  ====================================================== */
  try {
    const hamburger = safeQuerySelector("#hamburger");
    const mobileMenu = safeQuerySelector("#mobile-menu");
    const mobileLinks = safeQuerySelectorAll(".mobile-link");

    const closeMobile = () => {
      try {
        if (!mobileMenu) return;
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
        document.body.classList.remove("menu-open");
        if (hamburger) {
          hamburger.innerHTML = '<i data-lucide="menu"></i>';
          initLucideIcons();
        }
      } catch (error) {
        Logger.error("Erro ao fechar menu mobile", error);
      }
    };

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        try {
          const isOpen = mobileMenu.classList.toggle("open");
          document.body.style.overflow = isOpen ? "hidden" : "";
          document.body.classList.toggle("menu-open", isOpen);
          hamburger.innerHTML = isOpen
            ? '<i data-lucide="x"></i>'
            : '<i data-lucide="menu"></i>';
          initLucideIcons();
          Logger.info(`Menu ${isOpen ? "aberto" : "fechado"}`);
        } catch (error) {
          Logger.error("Erro ao alternar menu mobile", error);
        }
      });

      Logger.success("Menu mobile inicializado");
    }

    mobileLinks.forEach((link) => link.addEventListener("click", closeMobile));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobile();
    });
  } catch (error) {
    Logger.error("Erro ao inicializar menu mobile", error);
  }

  /* ======================================================
     6. SCROLL SUAVE
  ====================================================== */
  try {
    const smoothScrollLinks = safeQuerySelectorAll(
      ".menu a, .mobile-link, .btn-saiba-mais, .bottom-nav a",
    );
    smoothScrollLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        try {
          const target = link.getAttribute("href");
          if (!target || !target.startsWith("#")) return;

          const section = safeQuerySelector(target);
          if (!section) return;

          e.preventDefault();
          const header = safeQuerySelector("header");
          const headerHeight = header?.offsetHeight || 80;
          window.scrollTo({
            top: section.offsetTop - headerHeight,
            behavior: "smooth",
          });

          // Fecha menu mobile se estiver aberto
          const mobileMenu = safeQuerySelector("#mobile-menu");
          if (mobileMenu && mobileMenu.classList.contains("open")) {
            mobileMenu.classList.remove("open");
            document.body.style.overflow = "";
          }

          Logger.info(`Scroll para: ${target}`);
        } catch (error) {
          Logger.error("Erro no scroll suave", error);
        }
      });
    });
    if (smoothScrollLinks.length > 0)
      Logger.success("Scroll suave inicializado");
  } catch (error) {
    Logger.error("Erro ao inicializar scroll suave", error);
  }

  /* ======================================================
     7. CONTADORES ANIMADOS (COM EFEITO VISUAL)
  ====================================================== */
  const animateCounters = () => {
    try {
      const counters = safeQuerySelectorAll(".numbers-text");
      const duration = 2000;

      counters.forEach((counter) => {
        try {
          const targetText =
            counter.getAttribute("data-target") || counter.textContent;
          const target = parseInt(targetText.replace(/[^\d]/g, ""));
          const hasSuffix =
            targetText.includes("+") || targetText.includes("k");

          if (counter.classList.contains("animated")) return;

          counter.classList.add("animating");
          const start = 0;
          const startTime = performance.now();

          const update = (currentTime) => {
            try {
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

              const countUpSpan = safeQuerySelector(".count-up", counter);
              if (countUpSpan) {
                countUpSpan.textContent = displayValue.replace(/[^\d.k+]/g, "");
              } else {
                counter.textContent = displayValue;
              }

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                counter.classList.remove("animating");
                counter.classList.add("animated");
              }
            } catch (error) {
              Logger.error("Erro na animação do contador", error);
            }
          };

          requestAnimationFrame(update);
        } catch (error) {
          Logger.error("Erro ao processar contador", error);
        }
      });

      if (counters.length > 0)
        Logger.success("Contadores animados inicializados");
    } catch (error) {
      Logger.error("Erro ao animar contadores", error);
    }
  };

  /* ======================================================
     8. INTERSECTION OBSERVER (ANIMAÇÕES DE ENTRADA)
  ====================================================== */
  try {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        try {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Anima contadores quando aparecem
            if (entry.target.classList.contains("container-numbers")) {
              animateCounters();
            }

            observer.unobserve(entry.target);
          }
        } catch (error) {
          Logger.error("Erro no observer", error);
        }
      });
    }, observerOptions);

    // Observa seções
    safeQuerySelectorAll(".secao").forEach((section) => {
      section.classList.add("reveal");
      observer.observe(section);
    });

    // Observa container de números
    const numbersContainer = safeQuerySelector(".container-numbers");
    if (numbersContainer) {
      observer.observe(numbersContainer);
    }

    Logger.success("Intersection Observer inicializado");
  } catch (error) {
    Logger.error("Erro ao inicializar Intersection Observer", error);
    // Fallback: anima os contadores imediatamente
    setTimeout(animateCounters, 1000);
  }

  /* ======================================================
     9. BOTÃO VOLTAR AO TOPO
  ====================================================== */
  try {
    const backToTop = safeQuerySelector("#backToTop");
    if (backToTop) {
      const updateBackToTop = () => {
        try {
          backToTop.classList.toggle("show", window.pageYOffset > 400);
        } catch (error) {
          Logger.error("Erro ao atualizar botão back to top", error);
        }
      };

      window.addEventListener("scroll", updateBackToTop);

      backToTop.addEventListener("click", () => {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
          Logger.info("Voltando ao topo");
        } catch (error) {
          Logger.error("Erro ao voltar ao topo", error);
        }
      });

      updateBackToTop();
      Logger.success("Botão Back to Top inicializado");
    }
  } catch (error) {
    Logger.error("Erro ao inicializar Back to Top", error);
  }

  /* ======================================================
     10. SOCIAL FAB (MOBILE)
  ====================================================== */
  try {
    const socialFab = safeQuerySelector(".social-fab");
    const socialToggle = safeQuerySelector("#social-toggle");
    const socialActions = safeQuerySelector("#social-actions");

    if (socialFab && socialToggle && socialActions) {
      socialToggle.addEventListener("click", (e) => {
        try {
          e.stopPropagation();
          const open = socialFab.classList.toggle("open");
          socialActions.setAttribute("aria-hidden", !open);
          socialToggle.setAttribute("aria-expanded", open);
          Logger.info(`Social FAB ${open ? "aberto" : "fechado"}`);
        } catch (error) {
          Logger.error("Erro ao alternar Social FAB", error);
        }
      });

      document.addEventListener("click", (e) => {
        try {
          if (!socialFab.contains(e.target)) {
            socialFab.classList.remove("open");
            socialActions.setAttribute("aria-hidden", "true");
            socialToggle.setAttribute("aria-expanded", "false");
          }
        } catch (error) {
          Logger.error("Erro ao fechar Social FAB", error);
        }
      });

      Logger.success("Social FAB inicializado");
    }
  } catch (error) {
    Logger.error("Erro ao inicializar Social FAB", error);
  }

  /* ======================================================
     11. NAVBAR LATERAL SCROLL
  ====================================================== */
  try {
    const navbar = safeQuerySelector(".navbar");
    if (navbar) {
      const handleNavbarScroll = () => {
        try {
          if (window.pageYOffset > 100) {
            navbar.classList.add("scrolled");
          } else {
            navbar.classList.remove("scrolled");
          }
        } catch (error) {
          Logger.error("Erro ao processar scroll da navbar", error);
        }
      };

      window.addEventListener("scroll", handleNavbarScroll);
      handleNavbarScroll();
      Logger.success("Navbar scroll handler inicializado");
    }
  } catch (error) {
    Logger.error("Erro ao inicializar navbar scroll", error);
  }

  /* ======================================================
     12. ANIMAÇÃO DOS CARDS DE COMUNIDADES (STAGGER EFFECT)
  ====================================================== */
  try {
    const communityCards = safeQuerySelectorAll(".box-comunidade");

    if (communityCards.length > 0) {
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            try {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  entry.target.classList.add("visible");
                  entry.target.style.opacity = "1";
                  entry.target.style.transform = "translateY(0)";
                }, index * 100);

                cardObserver.unobserve(entry.target);
              }
            } catch (error) {
              Logger.error("Erro ao animar card", error);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      );

      communityCards.forEach((card) => {
        if (!card.style.opacity) {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          card.style.transition = "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)";
        }
        cardObserver.observe(card);
      });

      Logger.success(`${communityCards.length} cards de comunidade preparados`);
    }
  } catch (error) {
    Logger.error("Erro ao inicializar animação de cards", error);
  }

  /* ======================================================
     13. PREVENÇÃO DE CLIQUE MÚLTIPLO
  ====================================================== */
  try {
    safeQuerySelectorAll("a[href^='#'], button[type='button']").forEach(
      (element) => {
        element.addEventListener("click", function (e) {
          try {
            if (this.classList.contains("disabled")) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }

            this.classList.add("disabled");
            setTimeout(() => {
              this.classList.remove("disabled");
            }, 1000);
          } catch (error) {
            Logger.error("Erro na prevenção de clique", error);
          }
        });
      },
    );
    Logger.success("Prevenção de clique múltiplo ativada");
  } catch (error) {
    Logger.error("Erro ao inicializar prevenção de clique", error);
  }

  /* ======================================================
     14. REDIMENSIONAMENTO DA JANELA
  ====================================================== */
  try {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        try {
          if (swiper && swiper.update) {
            swiper.update();
          }

          const sobre = safeQuerySelector("#sobre");
          if (sobre && window.innerWidth >= 1024) {
            sobre.style.backgroundPositionY = window.pageYOffset * 0.5 + "px";
          }
        } catch (error) {
          Logger.error("Erro no resize handler", error);
        }
      }, 250);
    });
    Logger.success("Resize handler inicializado");
  } catch (error) {
    Logger.error("Erro ao inicializar resize handler", error);
  }

  /* ======================================================
     15. BOTTOM NAV HIGHLIGHT
  ====================================================== */
  try {
    const bottomNavItems = safeQuerySelectorAll(".bottom-nav .nav-item");
    const sections = safeQuerySelectorAll("section[id]");

    if (bottomNavItems.length > 0) {
      const highlightBottomNav = () => {
        try {
          let current = "";
          const header = safeQuerySelector("header");
          const headerHeight = header?.offsetHeight || 80;

          sections.forEach((section) => {
            const sectionTop = section.offsetTop;
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
        } catch (error) {
          Logger.error("Erro ao destacar bottom nav", error);
        }
      };

      window.addEventListener("scroll", highlightBottomNav);
      highlightBottomNav();
      Logger.success("Bottom nav highlight inicializado");
    }
  } catch (error) {
    Logger.error("Erro ao inicializar bottom nav", error);
  }

  Logger.success("✨ Aplicação inicializada com sucesso!");
});

// ======================================================
// WINDOW LOAD
// ======================================================
window.addEventListener("load", () => {
  try {
    Logger.info("📦 Carregamento completo");

    // Remove o preloader se existir
    const preloader = safeQuerySelector("#preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }

    // Atualiza Swiper após todas as imagens carregarem
    if (typeof swiper !== "undefined" && swiper && swiper.update) {
      setTimeout(() => {
        swiper.update();
      }, 300);
    }

    // Verifica swiper mobile
    checkMobileSwiper();

    Logger.success("✅ Carregamento concluído!");
  } catch (error) {
    Logger.error("Erro no carregamento", error);
  }
});

// ======================================================
// SWIPER RESPONSIVO PARA MOBILE
// ======================================================
const checkMobileSwiper = () => {
  try {
    const swiperContainer = safeQuerySelector(".mySwiper");
    if (!swiperContainer) return;

    const isMobile = window.innerWidth <= 768;
    const swiperWrapper = safeQuerySelector(".swiper-wrapper", swiperContainer);

    if (isMobile) {
      if (swiper && swiper.destroy) {
        try {
          swiper.destroy(true, true);
        } catch (e) {
          Logger.info("Swiper já destruído");
        }
      }

      if (swiperWrapper) {
        swiperWrapper.style.display = "grid";
        swiperWrapper.style.gridTemplateColumns = "1fr";
        swiperWrapper.style.gap = "25px";
        swiperWrapper.style.transform = "none !important";

        safeQuerySelectorAll(".swiper-slide").forEach((slide) => {
          slide.style.width = "100%";
          slide.style.opacity = "1";
          slide.style.transform = "none";
        });
      }
      Logger.info("Swiper modo mobile ativado");
    } else {
      if (!swiper || !swiper.initialized) {
        initSwiper();
      }

      if (swiperWrapper) {
        swiperWrapper.style.display = "";
        swiperWrapper.style.gridTemplateColumns = "";
        swiperWrapper.style.gap = "";
      }
      Logger.info("Swiper modo desktop ativado");
    }
  } catch (error) {
    Logger.error("Erro ao verificar Swiper responsivo", error);
  }
};

// Verifica no redimensionamento
window.addEventListener("resize", () => {
  setTimeout(checkMobileSwiper, 150);
});

// ======================================================
// ERROR HANDLING GLOBAL
// ======================================================
window.addEventListener("error", (event) => {
  Logger.error("Erro global capturado:", {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  Logger.error("Promise rejeitada:", event.reason);
});

// FIM DO ARQUIVO OTIMIZADO
