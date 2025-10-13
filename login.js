//prevents dropdown from closing
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.dropdown-menu form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.stopPropagation();
      // Your validation logic here (optional)
      e.preventDefault();
    });
  });

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
    });
  });
});

const apiUrl = 'https://viritual-board-login.onrender.com/users';

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

async function loginUser(email, password) {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', errorData.message);
      return null;
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      console.log('Login successful (token)');
    } else if (data.accessToken) {
      localStorage.setItem('authToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      console.log('Login successful (accessToken + refreshToken)');
    }
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const result = await loginUser(email, password);
  if (result) {
    window.location.href = 'index.html';
  } else {
    alert('Login failed. Please check your credentials.');
  }
});

async function signupUser(email, username, password) {
  try {
    const response = await fetch(`${apiUrl}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Signup failed:', errorData.message);
      return null;
    }
    const data = await response.json();
    console.log('Signup successful');
    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    return null;
  }
}

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const result = await signupUser(email, username, password);
  if (result) {
    alert('Signup successful! You can now log in.');
    signupForm.reset();
  } else {
    alert('Signup failed. Please try again.');
  }
});
