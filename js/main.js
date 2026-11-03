document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
    mainNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => mainNav.classList.remove("open"));
    });
  }

  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = "0 10px 30px -15px rgba(0,0,0,0.6)";
    } else {
      header.style.boxShadow = "none";
    }
  });

  // Stagger entrance animations: elements inside .stagger-group get an
  // incremental transition-delay so children animate in sequence.
  document.querySelectorAll(".stagger-group").forEach(group => {
    const items = group.querySelectorAll(":scope > .reveal");
    items.forEach((el, i) => {
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = `${i * 0.08}s`;
      }
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  revealEls.forEach(el => io.observe(el));
});
