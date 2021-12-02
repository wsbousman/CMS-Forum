async function signupFormHandler(event) {

    // prevent reload
    event.preventDefault();
  
    // grab user data, trim
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    // if there is user data, post it
    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    if (response.ok) {
        console.log('success');
    } else {
        alert(response.statusText);
    }    
    }
  }

async function loginFormHandler(event) {

    // prevent reload
    event.preventDefault();
  
    // grab user data, trim
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    // if there is user data, post it
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      // if login ok, redirect to dashboard
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  }
  
  // login/sign up form submit/enter listeners
  document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
  document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);