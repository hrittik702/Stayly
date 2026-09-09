// ==========================================================================
// Stayly Client-side Interactions & Utilities
// ==========================================================================

(() => {
  'use strict';

  // 1. Bootstrap Custom Form Validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      },
      false
    );
  });

  // 2. Live Image Preview Handler for New / Edit Listing Forms
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');
  const previewPlaceholder = document.getElementById('previewPlaceholder');

  if (imageInput && imagePreview) {
    const updatePreview = () => {
      const url = imageInput.value.trim();
      if (url) {
        imagePreview.src = url;
        imagePreview.style.display = 'block';
        if (previewPlaceholder) {
          previewPlaceholder.style.display = 'none';
        }
      } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        if (previewPlaceholder) {
          previewPlaceholder.style.display = 'flex';
        }
      }
    };

    imageInput.addEventListener('input', updatePreview);
    imageInput.addEventListener('change', updatePreview);

    // Initial check on load (for edit form)
    if (imageInput.value.trim()) {
      updatePreview();
    }
  }

  // 3. Navbar Elevation on Scroll
  const navbar = document.querySelector('.stayly-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 4. Category Filter Selection
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach((item) => {
    item.addEventListener('click', () => {
      categoryItems.forEach((c) => c.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // 5. Star Rating Selector Label Handler
  const starInputs = document.querySelectorAll('.stars-group input[type="radio"]');
  const ratingBadge = document.getElementById('ratingScoreLabel');
  const ratingLabels = {
    '5': '5.0 · Outstanding',
    '4': '4.0 · Very Good',
    '3': '3.0 · Good',
    '2': '2.0 · Fair',
    '1': '1.0 · Poor',
  };

  if (starInputs.length > 0 && ratingBadge) {
    const updateRatingText = (val) => {
      const labelText = ratingLabels[val] || `${val}.0`;
      ratingBadge.innerHTML = `<i class="fa-solid fa-star text-warning me-1"></i>${labelText}`;
    };

    starInputs.forEach((input) => {
      input.addEventListener('change', () => {
        updateRatingText(input.value);
      });
    });

    // Hover preview effect on star labels
    const starLabels = document.querySelectorAll('.stars-group label');
    starLabels.forEach((label) => {
      label.addEventListener('mouseenter', () => {
        const inputId = label.getAttribute('for');
        const input = document.getElementById(inputId);
        if (input) {
          updateRatingText(input.value);
        }
      });
    });

    const starsGroup = document.querySelector('.stars-group');
    if (starsGroup) {
      starsGroup.addEventListener('mouseleave', () => {
        const checked = document.querySelector('.stars-group input[type="radio"]:checked');
        if (checked) {
          updateRatingText(checked.value);
        }
      });
    }
  }

  // 6. Password Visibility Toggle
  const togglePasswordBtns = document.querySelectorAll('.auth-toggle-btn');
  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const inputGroup = btn.closest('.auth-input-group');
      const input = inputGroup ? inputGroup.querySelector('input') : document.getElementById('password');
      const icon = btn.querySelector('i');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
          }
          btn.setAttribute('title', 'Hide password');
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
          }
          btn.setAttribute('title', 'Show password');
        }
      }
    });
  });

  // 7. Modern Flash Toast Notifications Handler
  const flashToasts = document.querySelectorAll('.stayly-flash-toast');
  flashToasts.forEach((toast) => {
    const dismissDuration = 5000;
    let startTime = Date.now();
    let remainingTime = dismissDuration;
    let timerId = null;

    const dismissToast = () => {
      if (toast.classList.contains('flash-hiding')) return;
      toast.classList.add('flash-hiding');
      setTimeout(() => {
        toast.remove();
        const container = document.getElementById('staylyFlashContainer');
        if (container && container.children.length === 0) {
          container.remove();
        }
      }, 350);
    };

    const startTimer = () => {
      startTime = Date.now();
      timerId = setTimeout(dismissToast, remainingTime);
    };

    const pauseTimer = () => {
      clearTimeout(timerId);
      remainingTime -= Date.now() - startTime;
    };

    // Auto-dismiss countdown
    startTimer();

    // Pause timer on hover, resume on mouse leave
    toast.addEventListener('mouseenter', pauseTimer);
    toast.addEventListener('mouseleave', () => {
      if (remainingTime > 0) {
        startTimer();
      }
    });

    // Close button click
    const closeBtn = toast.querySelector('.flash-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(timerId);
        dismissToast();
      });
    }
  });
})();
