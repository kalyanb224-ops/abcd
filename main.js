document.addEventListener('DOMContentLoaded', () => {
  
  // 1. FLOATING HEADER SCROLL EFFECT
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU DRAWER TOGGLE
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');
  const navItems = navLinks.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // 3. ACTIVE NAV LINK TRACKING ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // adjust offset for header height
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll);

  // 4. ANIMATED STATS COUNTER
  const statsSection = document.querySelector('.stats');
  const statNumbers = document.querySelectorAll('.stat-num');
  let countStarted = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-val'));
    const suffix = element.innerText.includes('%') ? '%' : (element.innerText.includes('+') ? '+' : '');
    let current = 0;
    const duration = 2000; // 2 seconds animation
    const increment = target / (duration / 16); // ~60fps

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.innerText = target + suffix;
        clearInterval(counter);
      } else {
        element.innerText = Math.floor(current) + suffix;
      }
    }, 16);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !countStarted) {
      countStarted = true;
      statNumbers.forEach(num => {
        // preserve percentage or plus signs
        if (num.innerText.includes('%') || num.getAttribute('data-val') === '98') {
          num.innerText = '0%';
        } else if (num.innerText.includes('+') || num.getAttribute('data-val') === '45' || num.getAttribute('data-val') === '1500') {
          num.innerText = '0+';
        } else {
          num.innerText = '0';
        }
        countUp(num);
      });
      statsObserver.unobserve(entry.target);
    }
  }, { threshold: 0.2 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 5. SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal, .academic-card, .gallery-item, .contact-info-panel, .contact-form-panel');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 6. GALLERY FILTERING LOGIC
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // trigger layout re-flow for smooth entry
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          // wait for transition to end before hiding completely
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 7. TESTIMONIALS SLIDER
  const slidesContainer = document.getElementById('testimonial-slides');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('testimonial-dots');
  const dots = document.querySelectorAll('.testimonial-dot');
  
  let currentSlide = 0;
  const slideCount = slides.length;
  let slideInterval;

  const updateSlider = () => {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlider();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlider();
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 6000); // changes every 6s
  };

  const stopAutoSlide = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  };

  // Click listeners for control arrows
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide(); // reset timer
    });
    
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide(); // reset timer
    });
  }

  // Click listeners for indicator dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlider();
      startAutoSlide(); // reset timer
    });
  });

  // Hover pauses the auto slide
  const testimonialContainer = document.querySelector('.testimonial-container');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
    testimonialContainer.addEventListener('mouseleave', startAutoSlide);
    startAutoSlide();
  }

  // 8. FAQ ACCORDION COLLAPSE/EXPAND
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other accordions
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        // set height based on scrollHeight of child content
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // 9. FORM SUBMISSION INTERCEPT & TOAST NOTIFICATION
  const tourForm = document.getElementById('tour-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const toast = document.getElementById('toast-notif');
  const toastMsg = document.getElementById('toast-msg');

  const showToast = (message) => {
    toastMsg.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  };

  if (tourForm) {
    // Set minimum tour date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('tour-date');
    if (dateInput) {
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    tourForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect input data for demonstration
      const parentName = document.getElementById('parent-name').value;
      const tourDate = document.getElementById('tour-date').value;
      
      // Visual feedback submit button state change
      const submitBtn = tourForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Request...';
      
      setTimeout(() => {
        // Success response representation
        showToast(`Thank you, ${parentName}! Your tour request for ${tourDate} is submitted.`);
        tourForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      const emailVal = emailInput.value;
      
      const submitBtn = newsletterForm.querySelector('.newsletter-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

      setTimeout(() => {
        showToast(`Successfully subscribed: ${emailVal}!`);
        newsletterForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-envelope"></i>';
      }, 1000);
    });
  }

  // 10. SMOOTH SCROLL FROM HERO INDICATOR
  const scrollIndicator = document.getElementById('scroll-to-stats');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSec = document.querySelector('.stats');
      if (nextSec) {
        nextSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});
