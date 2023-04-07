const loadCommentsBtnElement = document.getElementById('load-comments-btn');
const commentsSelectionElement = document.getElementById('comments');
const commentFormElement = document.querySelector('#comments-form form');
const commentTitleElement = document.getElementById('title');
const commentTextElement = document.getElementById('text');

const createCommentsList = (comments) => {
  const commentListElement = document.createElement('ol');

  for(const comment of comments){
    const commentElement = document.createElement('li');
    commentElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>
    `;  
    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

const fetchCommentsForPost = async () => {
  const postId = loadCommentsBtnElement.dataset.postid;

  try{
    const response = await fetch(`/posts/${postId}/comments`);
    if(!response.ok){
      alert('Fetching comments failed!');
      return;
    }
    const responseData = await response.json();
    console.log(responseData);

    if(responseData && responseData.length > 0){
      const commentsListElement = createCommentsList(responseData);
      commentsSelectionElement.innerHTML = '';
      commentsSelectionElement.appendChild(commentsListElement);
    } else {
      commentsSelectionElement.firstElementChild.textContent = 
      'We could not find any comments, maybe add one?';
    }
  } catch(error) {
    alert('getting comment failed!');
  }

}

const saveComment = async (event) => {
  event.preventDefault();
  const postId = commentFormElement.dataset.postid;

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;

  const comment = {title:enteredTitle,text:enteredText};

  console.log(enteredTitle,enteredText);


  try{
    const response = await fetch(`/posts/${postId}/comments`,{
      method:'POST',
      body: JSON.stringify(comment),
      headers: {
        'Content-type': 'application/json'
      }
    });
    if(response.ok){
      fetchCommentsForPost();
    }else {
      alert('Could not send comment!');
    }
  } catch(error) {
    alert('Could not send request - maybe try again later!');
  }

}

loadCommentsBtnElement.addEventListener('click',fetchCommentsForPost);
commentFormElement.addEventListener('submit',saveComment);