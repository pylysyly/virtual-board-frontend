//prevents dropdown from closing
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.dropdown-menu form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.stopPropagation();
      // Your validation logic here (optional)
      e.preventDefault();
    });
  });

  //LÄGG TILL ANTI INJECTION I ALLA TEXTFÄLT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //Lagg till att checka boda inputs so dom inte e tomma!!!!!!!!!!!!!


  // email o pass check
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const emailInputs = form.querySelectorAll('input[type="email"]');
      let valid = true;
      emailInputs.forEach(function (input) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
          valid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
      //
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
      const emailValue = form.querySelector('input[type="email"]').value;
      const passwordValue = form.querySelector('input[type="password"]').value;
    });
  });
});