const postInput = document.getElementById("post-input");
const publishBtn = document.getElementById("publish-btn");
const postsContainer = document.getElementById("posts-container");

const currentUser = {
  name: "Alex Johnson",
  image: "https://i.pravatar.cc/60?img=12"
};

const initialPosts = [
  {
    id: Date.now(),
    name: "Alex Johnson",
    image: "https://i.pravatar.cc/60?img=12",
    text: "Excited to share that I am building a LinkedIn-style frontend project with HTML, CSS, and JavaScript!"
  }
];

let posts = [...initialPosts];

function createPostElement(post) {
  const postCard = document.createElement("article");
  postCard.className = "post";

  postCard.innerHTML = `
    <div class="post-header">
      <img src="${post.image}" alt="${post.name}" />
      <div>
        <strong>${post.name}</strong>
        <p class="title">Web Developer</p>
      </div>
    </div>
    <p class="post-content">${post.text}</p>
    <div class="post-actions">
      <button class="action-btn like-btn">👍 Like</button>
      <button class="action-btn comment-btn">💬 Comment</button>
      <button class="action-btn">↗ Share</button>
    </div>
    <div class="comment-box">
      <input type="text" placeholder="Write a comment..." />
    </div>
  `;

  const likeBtn = postCard.querySelector(".like-btn");
  const commentBtn = postCard.querySelector(".comment-btn");
  const commentBox = postCard.querySelector(".comment-box");

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("liked");
    likeBtn.textContent = likeBtn.classList.contains("liked")
      ? "✅ Liked"
      : "👍 Like";
  });

  commentBtn.addEventListener("click", () => {
    commentBox.style.display = commentBox.style.display === "block" ? "none" : "block";
  });

  return postCard;
}

function renderPosts() {
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

function publishPost() {
  const content = postInput.value.trim();

  if (!content) {
    alert("Please write something before publishing.");
    return;
  }

  const newPost = {
    id: Date.now(),
    name: currentUser.name,
    image: currentUser.image,
    text: content
  };

  posts.unshift(newPost);
  postInput.value = "";
  renderPosts();
}

publishBtn.addEventListener("click", publishPost);

postInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    publishPost();
  }
});

renderPosts();
