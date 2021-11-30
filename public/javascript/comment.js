async function commentFormHandler(event) {

    // prevent reload
    event.preventDefault();

    // grab input, trim
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    // grab post id by splitting url into substrings on forward slashes, return final index
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    
    // if there is comment data, post it
    if (comment_text) {
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id,
            comment_text
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (response.ok) {
          document.location.reload();
        } else {
          alert(response.statusText);
        }
      }  
}

// submit/enter listener
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);