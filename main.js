// Появление элементов при скролле
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

const animatedElements = document.querySelectorAll(
  ".f-item, .hero-text, .iphone-frame, .security-card, .about-col, .pricing-card, .pricing-header, .testimonial-card, .testimonials-header, .faq-header, .how-header, .how-step, .channels-header, .channel-card, .demo-header, .demo-chat-inner, .referral-inner, .compare-inner, .download-header, .download-platforms, .footer-inner"
);

animatedElements.forEach((el, index) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "1.2s cubic-bezier(0.2, 0, 0.2, 1)";
  el.style.transitionDelay = `${index * 0.06}s`;
  observer.observe(el);
});

// Параллакс для блока с телефоном
const phoneDisplay = document.querySelector(".phone-display");
const bgGrid = document.querySelector(".bg-grid");
const bgGlow1 = document.querySelector(".bg-glow-1");
const bgGlow2 = document.querySelector(".bg-glow-2");

if (phoneDisplay) {
  document.addEventListener("pointermove", (event) => {
    const xNorm = event.clientX / window.innerWidth - 0.5;
    const yNorm = event.clientY / window.innerHeight - 0.5;

    const xOffset = xNorm * 16;
    const yOffset = yNorm * 16;

    phoneDisplay.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
  });
}

// Скролл-эффекты: параллакс фона + прогресс
let lastScrollY = window.scrollY;
let scrollTicking = false;
const scrollProgressBar = document.querySelector(".scroll-progress-bar");

const updateScrollEffects = () => {
  const offset = lastScrollY * 0.04;

  if (bgGrid) {
    bgGrid.style.transform = `translateY(${offset * 0.6}px)`;
  }
  if (bgGlow1) {
    bgGlow1.style.transform = `translateY(${offset}px)`;
  }
  if (bgGlow2) {
    bgGlow2.style.transform = `translateY(${-offset * 0.6}px)`;
  }

  if (scrollProgressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, lastScrollY / docHeight)) : 0;
    scrollProgressBar.style.width = `${progress * 100}%`;
  }

  scrollTicking = false;
};

window.addEventListener("scroll", () => {
  lastScrollY = window.scrollY;

  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollEffects);
    scrollTicking = true;
  }
});

// Плавный скролл для пунктов навигации
document.querySelectorAll(".nav a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();

    const navHeight = 90;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  });
});

// Переключатель биллинга тарифов
const pricingToggle = document.querySelector(".pricing-toggle");

if (pricingToggle) {
  const toggleButtons = pricingToggle.querySelectorAll(".toggle-btn");
  const priceBlocks = document.querySelectorAll(".pricing-price");

  const applyBillingMode = (mode) => {
    priceBlocks.forEach((priceEl) => {
      const monthly = priceEl.dataset.monthly;
      const yearly = priceEl.dataset.yearly;
      const valueSpan = priceEl.querySelector(".pricing-price-value");
      const periodSpan = priceEl.querySelector(".pricing-price-period");

      if (!valueSpan || !periodSpan) return;

      if (mode === "yearly") {
        valueSpan.textContent = yearly + " ₽";
        periodSpan.textContent = "/год";
      } else {
        valueSpan.textContent = monthly + " ₽";
        periodSpan.textContent = "/мес";
      }
    });
  };

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.planBilling || "monthly";
      pricingToggle.dataset.billing = mode;

      toggleButtons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });

      applyBillingMode(mode);
    });
  });

  applyBillingMode(pricingToggle.dataset.billing || "monthly");
}

// Аккордеон FAQ
const faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length) {
  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((i) => i.classList.remove("is-open"));

      if (!isOpen) {
        item.classList.add("is-open");
      }
    });
  });
}

// Подсветка активных чатов в списке
const chatRows = document.querySelectorAll(".chat-row");

if (chatRows.length) {
  let activeIndex = 0;

  setInterval(() => {
    chatRows.forEach((row, index) => {
      row.classList.toggle("is-active", index === activeIndex);
    });

    activeIndex = (activeIndex + 1) % chatRows.length;
  }, 3200);
}

// Демо‑чат: поочерёдное появление сообщений
const demoMessages = document.querySelectorAll(".demo-message");
const demoTyping = document.querySelector(".demo-typing");

if (demoMessages.length) {
  let demoIndex = -1;

  setInterval(() => {
    demoMessages.forEach((msg) => msg.classList.remove("is-visible"));

    demoIndex = (demoIndex + 1) % demoMessages.length;

    const current = demoMessages[demoIndex];
    if (current) {
      current.classList.add("is-visible");
    }

    if (demoTyping) {
      demoTyping.style.opacity = demoIndex === demoMessages.length - 1 ? "1" : "0.4";
    }
  }, 2600);
}

// Переключатель темы (тёмная/светлая)
const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
  const THEME_KEY = "neonik-theme";

  const applyTheme = (mode) => {
    if (mode === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  };

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
  }

  themeToggle.addEventListener("click", () => {
    const isLight = !document.body.classList.contains("light-theme");
    applyTheme(isLight ? "light" : "dark");
    window.localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
  });
}

