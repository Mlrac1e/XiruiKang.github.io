const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

function initPortraitFallback() {
  const photo = document.querySelector(".profile-photo");
  const frame = document.querySelector(".portrait-frame");

  if (!photo || !frame) return;

  photo.addEventListener("error", () => {
    frame.classList.add("is-missing");
    photo.remove();
  });
}

function initFallback() {
  document.querySelector(".intro-sequence")?.remove();
  document.querySelectorAll(".reveal, .reveal-card, .section-heading > *, .body-copy p, .hero-facts p").forEach((element) => {
    element.style.opacity = "1";
  });
}

initPortraitFallback();

if (!window.gsap) {
  initFallback();
} else {
  const { gsap } = window;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  if (reduceMotion) {
    document.querySelector(".intro-sequence")?.remove();
    gsap.set(".reveal, .reveal-card, .section-heading > *, .body-copy p, .hero-facts p", {
      autoAlpha: 1,
      y: 0,
    });
  } else {
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTimeline
      .set(".site-header, main", { autoAlpha: 0 })
      .fromTo(
        ".intro-sequence .svg-orbit",
        { autoAlpha: 0, scale: 0.9, transformOrigin: "50% 50%" },
        { autoAlpha: 1, scale: 1, duration: 0.8 }
      )
      .fromTo(
        ".intro-sequence .svg-wire, .intro-sequence .logic-arc, .intro-sequence .robot-head, .intro-sequence .robot-jaw, .intro-sequence .robot-mouth",
        { strokeDasharray: 420, strokeDashoffset: 420 },
        { strokeDashoffset: 0, duration: 1.32, stagger: 0.055 },
        "-=0.28"
      )
      .fromTo(
        ".intro-sequence .robot-eye, .intro-sequence .node, .intro-sequence .logic-text, .intro-robot p",
        { autoAlpha: 0, scale: 0.86, transformOrigin: "50% 50%" },
        { autoAlpha: 1, scale: 1, duration: 0.42, stagger: 0.04 },
        "-=0.4"
      )
      .to(".intro-sequence", { autoAlpha: 0, duration: 0.76, ease: "power2.inOut" }, "+=0.46")
      .set(".intro-sequence", { display: "none" })
      .set(".site-header, main", { autoAlpha: 1 })
      .fromTo(
        ".reveal",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.09 }
      )
      .fromTo(
        ".hero-facts p",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.42"
      );

    if (window.ScrollTrigger) {
      gsap.utils.toArray(".section-heading").forEach((heading) => {
        gsap.fromTo(
          heading.children,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: heading,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray(".body-copy").forEach((copy) => {
        gsap.fromTo(
          copy.querySelectorAll("p"),
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: copy,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray(".reveal-card").forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray(".experience-item, .paper-card").forEach((item) => {
        const children = item.classList.contains("paper-card")
          ? item.querySelectorAll(".paper-meta, .paper-content")
          : item.querySelectorAll("time, span, strong, h3, p, a");

        gsap.fromTo(
          children,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    } else {
      gsap.set(".reveal-card, .section-heading > *, .body-copy p, .hero-facts p", {
        autoAlpha: 1,
        y: 0,
      });
    }

    gsap.to(".logic-field span", {
      y: "random(-22, 22)",
      x: "random(-14, 14)",
      rotation: "random(-5, 5)",
      duration: "random(4, 7)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.18,
    });

    gsap.to(".intro-sequence .svg-orbit", {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 36,
      ease: "none",
      repeat: -1,
      stagger: 3,
    });
  }

  if (!reduceMotion && hasFinePointer) {
    const orb = document.querySelector(".cursor-orb");
    const moveX = gsap.quickTo(orb, "x", { duration: 0.55, ease: "power3" });
    const moveY = gsap.quickTo(orb, "y", { duration: 0.55, ease: "power3" });

    window.addEventListener("pointermove", (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
    });
  }
}
