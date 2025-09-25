document.addEventListener('DOMContentLoaded', function () {
  // Prevent dropdown from closing when submitting the form inside it
  document.querySelectorAll('.dropdown-menu form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.stopPropagation(); // Prevent Bootstrap from closing the dropdown
      // Your validation logic here (optional)
      e.preventDefault(); // Remove this if you want to actually submit the form
    });
  });

  // Select all forms on the page
  document.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      // Find all email inputs in the form
      const emailInputs = form.querySelectorAll('input[type="email"]');
      let valid = true;
      emailInputs.forEach(function(input) {
        // Simple email regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
          valid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!valid) {
        e.preventDefault();
        if (submitBtn) {
          const originalText = submitBtn.dataset.originalText || submitBtn.textContent;
          submitBtn.textContent = 'Invalid';
          submitBtn.classList.add('btn-danger');
          submitBtn.dataset.originalText = originalText;
          setTimeout(() => {
            submitBtn.textContent = submitBtn.dataset.originalText;
            submitBtn.classList.remove('btn-danger');
          }, 1500);
        }
      }
    });
  });
});