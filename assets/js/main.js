/**
 * Co-Box Logistics - Main JavaScript
 * Este archivo contiene todas las funcionalidades interactivas del sitio
 */

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Header scroll effect
  const header = document.getElementById("header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    
    // Ejecutar una vez al cargar la página
    handleScroll();
    
    // Agregar listener de scroll
    window.addEventListener("scroll", handleScroll);
  }

  // Language selector
  const languageSelect = document.getElementById("languageSelect");

  /**
   * Traduce todos los elementos de la página al idioma seleccionado
   * @param {string} lang - Código de idioma ('es' o 'en')
   */
  function translatePage(lang) {
    // Set the HTML lang attribute
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // 1. Text elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const txt = window.translations[lang]?.[key];
      if (txt) el.textContent = txt;
    });
  
    // 2. Attributes with data-i18n-attr attribute (for placeholders, etc.)
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      const attrInfo = el.getAttribute("data-i18n-attr").split("|");
      const attr = attrInfo[0];
      const key = attrInfo[1];
      const txt = window.translations[lang]?.[key];
      if (txt) el.setAttribute(attr, txt);
    });
    
    // 3. Update select options with data-i18n
    document.querySelectorAll("select option[data-i18n]").forEach(option => {
      const key = option.getAttribute("data-i18n");
      const txt = window.translations[lang]?.[key];
      if (txt) option.textContent = txt;
    });
    
    // 4. Update feature details for modal
    updateFeatureDetails(lang);
  }
  
  /**
   * Actualiza los detalles de características para el modal según el idioma
   * @param {string} lang - Código de idioma ('es' o 'en')
   */
  function updateFeatureDetails(lang) {
    // Update the feature details based on language
    const featureDetails = {
      feature1: {
        title: window.translations[lang]?.["feature1.title"] || "Programación de servicios",
        demo: lang === "es" ? "Demostración de programación de servicios" : "Service scheduling demonstration",
        description: lang === "es" 
          ? "Crea viajes con código único, ruta (origen, paradas intermedias, destino), chofer asignado, placa del vehículo y hora de salida. Organiza tu flota de manera eficiente y mantén un registro detallado de cada servicio."
          : "Create trips with unique code, route (origin, intermediate stops, destination), assigned driver, vehicle plate and departure time. Efficiently organize your fleet and maintain a detailed record of each service."
      },
      feature2: {
        title: window.translations[lang]?.["feature2.title"] || "Captura de kilometraje",
        demo: lang === "es" ? "Demostración de captura de kilometraje" : "Mileage capture demonstration",
        description: lang === "es"
          ? "Toma foto del odómetro y registra kilómetros al instante desde la app móvil. Mantén un registro preciso del kilometraje con evidencia fotográfica para auditorías y control de costos."
          : "Take a photo of the odometer and record kilometers instantly from the mobile app. Keep an accurate record of mileage with photographic evidence for audits and cost control."
      },
      feature3: {
        title: window.translations[lang]?.["feature3.title"] || "Gestión de combustible",
        demo: lang === "es" ? "Demostración de gestión de combustible" : "Fuel management demonstration",
        description: lang === "es"
          ? "Registra galones cargados, calcula kms/galón y obtiene reportes de eficiencia automáticamente. Identifica patrones de consumo y optimiza el rendimiento de tu flota."
          : "Record loaded gallons, calculate km/gallon and automatically get efficiency reports. Identify consumption patterns and optimize your fleet's performance."
      }
    };
    
    window.featureDetailsData = featureDetails;
  }

  // Initialize language
  if (languageSelect) {
    // Set default language based on browser preference or default to Spanish
    const browserLang = navigator.language && navigator.language.split('-')[0];
    const defaultLang = ['es', 'en'].includes(browserLang) ? browserLang : 'es';
    
    // Set the select value if it doesn't match the default language
    if (languageSelect.value !== defaultLang) {
      languageSelect.value = defaultLang;
    }
    
    // Apply initial translation
    translatePage(languageSelect.value);

    // Language change event
    languageSelect.addEventListener("change", e => {
      translatePage(e.target.value);
    });
  }

  // Mobile menu toggle
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      mobileNav.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll("a");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("active");
        mobileNav.classList.remove("active");
      });
    });
  }

  // Video modal
  const videoBtn = document.getElementById("videoBtn");
  const videoModal = document.getElementById("videoModal");
  
  if (videoBtn && videoModal) {
    const videoModalClose = videoModal.querySelector(".modal-close");

    videoBtn.addEventListener("click", () => {
      videoModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    if (videoModalClose) {
      videoModalClose.addEventListener("click", () => {
        videoModal.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  }

  // Feature modals
  const featureButtons = document.querySelectorAll(".feature-more");
  const featureModal = document.getElementById("featureModal");
  
  if (featureButtons.length > 0 && featureModal) {
    const featureModalClose = featureModal.querySelector(".modal-close");
    const featureTitle = document.getElementById("featureTitle");
    const featureDemo = document.getElementById("featureDemo");
    const featureDescription = document.getElementById("featureDescription");

    // Create global variable to store feature details
    window.featureDetailsData = {};
    
    // Initialize feature details
    updateFeatureDetails(languageSelect ? languageSelect.value : 'es');

    featureButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const featureId = this.getAttribute("data-feature");
        const feature = window.featureDetailsData[featureId];

        if (feature && featureTitle && featureDemo && featureDescription) {
          featureTitle.textContent = feature.title;
          featureDemo.textContent = feature.demo;
          featureDescription.textContent = feature.description;

          featureModal.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    });

    if (featureModalClose) {
      featureModalClose.addEventListener("click", () => {
        featureModal.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  }

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (videoModal && event.target === videoModal) {
      videoModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (featureModal && event.target === featureModal) {
      featureModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Testimonial slider
  const testimonialTrack = document.querySelector(".testimonial-track");
  
  if (testimonialTrack) {
    const testimonialSlides = document.querySelectorAll(".testimonial-slide");
    const testimonialDots = document.querySelectorAll(".testimonial-dot");
    const prevButton = document.querySelector(".testimonial-arrow.prev");
    const nextButton = document.querySelector(".testimonial-arrow.next");
    let currentTestimonial = 0;
    let testimonialInterval;

    function updateTestimonials() {
      testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

      testimonialDots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentTestimonial);
      });
    }

    function prevTestimonial() {
      currentTestimonial = currentTestimonial === 0 ? testimonialSlides.length - 1 : currentTestimonial - 1;
      updateTestimonials();
    }

    function nextTestimonial() {
      currentTestimonial = currentTestimonial === testimonialSlides.length - 1 ? 0 : currentTestimonial + 1;
      updateTestimonials();
    }

    // Initialize testimonial slider
    updateTestimonials();

    // Ensure these elements exist before adding event listeners
    if (prevButton) {
      prevButton.addEventListener("click", function(e) {
        e.preventDefault();
        prevTestimonial();
        // Reset auto-rotation timer on manual navigation
        if (testimonialInterval) {
          clearInterval(testimonialInterval);
          testimonialInterval = setInterval(nextTestimonial, 5000);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function(e) {
        e.preventDefault();
        nextTestimonial();
        // Reset auto-rotation timer on manual navigation
        if (testimonialInterval) {
          clearInterval(testimonialInterval);
          testimonialInterval = setInterval(nextTestimonial, 5000);
        }
      });
    }

    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentTestimonial = index;
        updateTestimonials();
        // Reset auto-rotation timer on manual navigation
        if (testimonialInterval) {
          clearInterval(testimonialInterval);
          testimonialInterval = setInterval(nextTestimonial, 5000);
        }
      });
    });

    // Auto-advance testimonials
    testimonialInterval = setInterval(nextTestimonial, 5000);

    // Pause auto-advance on hover
    const testimonialSlider = document.querySelector(".testimonial-slider");
    if (testimonialSlider) {
      testimonialSlider.addEventListener("mouseenter", () => {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
      });

      testimonialSlider.addEventListener("mouseleave", () => {
        if (!testimonialInterval) {
          testimonialInterval = setInterval(nextTestimonial, 5000);
        }
      });
    }
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const sendAnother = document.getElementById("sendAnother");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) return;

      // Add loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.classList.add("loading");

        // Simulate form submission
        setTimeout(() => {
          submitButton.classList.remove("loading");
          contactForm.style.display = "none";
          formSuccess.style.display = "block";
        }, 1500);
      }
    });

    if (sendAnother) {
      sendAnother.addEventListener("click", () => {
        formSuccess.style.display = "none";
        contactForm.style.display = "block";
        contactForm.reset();
      });
    }
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (href === "#" || href === "") return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerOffset = 80; // Height of fixed header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animate elements on scroll
  const animateElements = document.querySelectorAll("[data-aos]");

  if (animateElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
        }
      });
    }, observerOptions);

    animateElements.forEach((element) => {
      observer.observe(element);
    });
    
    // Initialize AOS manually for elements already in viewport
    const initAOS = () => {
      setTimeout(() => {
        const visibleElements = document.querySelectorAll("[data-aos]");
        visibleElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            el.classList.add("aos-animate");
          }
        });
      }, 100);
    };
    
    // Call once on page load
    initAOS();
    
    // Also initialize on window resize
    window.addEventListener('resize', initAOS);
  }
});