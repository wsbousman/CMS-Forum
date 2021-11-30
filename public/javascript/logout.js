async function logout() {
    const response = await fetch('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (response.ok) {
      // redirect to homepage
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }
  
  // logout button click listener
  document.querySelector('#logout').addEventListener('click', logout);