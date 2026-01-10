document.documentElement.classList.add("js-enabled");
document.addEventListener("DOMContentLoaded", () => {
  /* ======================================================
     1. ICONS (LUCIDE)
  ====================================================== */
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }

  /* ======================================================
     2. SECTION REVEAL (.secao)  **CRÍTICO**
  ====================================================== */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".secao").forEach((secao) => {
    sectionObserver.observe(secao);
  });

  /* ======================================================
     3. ELEMENT REVEAL (.reveal)
  ====================================================== */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  /* ======================================================
     4. FAQ ACCORDION
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
     5. SWIPER + FILTROS
  ====================================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");

  let swiper;
  if (typeof Swiper !== "undefined") {
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
        swiper.update();
        swiper.slideTo(0);
      }
    });
  });

  /* ======================================================
     6. DARK MODE
  ====================================================== */
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  if (darkModeToggle) {
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-theme");
      darkModeToggle.innerHTML = '<i data-lucide="sun"></i>';
      lucide.createIcons();
    }

    darkModeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");

      darkModeToggle.innerHTML = isDark
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';

      localStorage.setItem("theme", isDark ? "dark" : "light");
      lucide.createIcons();
    });
  }

  /* ======================================================
     7. MENU MOBILE
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
      lucide.createIcons();
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
      lucide.createIcons();
    });
  }

  mobileLinks.forEach((link) => link.addEventListener("click", closeMobile));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobile();
  });

  /* ======================================================
     8. SMOOTH SCROLL
  ====================================================== */
  document.querySelectorAll(".menu a, .mobile-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("href");
      if (!target || !target.startsWith("#")) return;

      const section = document.querySelector(target);
      if (!section) return;

      e.preventDefault();
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    });
  });

  /* ======================================================
     9. CONTADORES
  ====================================================== */
  const startCounting = () => {
    document.querySelectorAll(".count-up").forEach((counter) => {
      const target = +counter.dataset.target;
      let current = 0;
      const increment = target / 80;

      const update = () => {
        current += increment;
        if (current < target) {
          let display = Math.ceil(current);
          counter.innerText =
            display >= 1000 ? (display / 1000).toFixed(1) + "k" : display;
          requestAnimationFrame(update);
        } else {
          counter.innerText =
            target >= 1000 ? (target / 1000).toFixed(1) + "k" : target;
        }
      };
      update();
    });
  };

  const counterSection = document.querySelector(".container-numbers");
  if (counterSection) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          startCounting();
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    counterObserver.observe(counterSection);
  }

  /* ======================================================
     10. PARALLAX
  ====================================================== */
  const sobre = document.getElementById("sobre");
  if (sobre) {
    window.addEventListener("scroll", () => {
      sobre.style.backgroundPositionY = window.pageYOffset * 0.5 + "px";
    });
  }

  /* ======================================================
     11. BACK TO TOP
  ====================================================== */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.pageYOffset > 400);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ======================================================
     12. SOCIAL FAB
  ====================================================== */
  const socialFab = document.querySelector(".social-fab");
  const socialToggle = document.getElementById("social-toggle");
  const socialActions = document.getElementById("social-actions");

  if (socialFab && socialToggle && socialActions) {
    socialToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = socialFab.classList.toggle("open");
      socialActions.setAttribute("aria-hidden", !open);
    });

    document.addEventListener("click", (e) => {
      if (!socialFab.contains(e.target)) {
        socialFab.classList.remove("open");
        socialActions.setAttribute("aria-hidden", "true");
      }
    });
  }
});
