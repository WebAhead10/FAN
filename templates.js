function layout(content) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title> FAN</title>
       <link rel="stylesheet" href="/main-style.css" />
      </head>
      <body class="student-name">
     
        ${content}
      </body>
    </html>
  `;
}

function newPost(name, user) {
  return layout(/*html */ ` <link rel="stylesheet" href="/main-style.css" />
    <h1 class="h1">Add a new post</h1>
    <form action="/new-post/${name}" method="POST">
      <label class="h2" for="author">
        Your name<span aria-hidden="true">*</span>
      </label><br>
      <label class="h2" for="author">${user}</label>
      <br>
      <label class="h2" for="title">
        Post title<span aria-hidden="true">*</span>
      </label>
     
      <input class="input" id="title" type="text" name="title" required>
      <br>
      <label class="h2" for="content">Post content</label>
      <textarea class="input" id="content" name="content"></textarea>
      <br>
      <button class="btn" type="submit">Save post</button>
    </form>
    <a href="/profiles"> <button class="btn2" > Back </button></a></script>
  `);
}

function allPosts(posts, student) {
  return layout(/*html */ `
   <link rel="stylesheet" href="/main-style.css" />
    <h1 class ="h1">All posts</h1>
    <ul>
      ${posts
        .map(
          (post) => `
          <li>
            <a class="a" href="/post/${post.title}">${post.title}</a>
            <a class="a" href="/delete-post/${post.title}" aria-label="Delete post titled ${post.title}">🗑</a>
          </li>
          
        `
        )
        .join("")}
    </ul>
    
    <a href="/profiles/${
      student.name
    }"> <button class="btn1" > Back </button></a>

  `);
}

function post(post) {
  return layout(/*html */ `
   <link rel="stylesheet" href="/main-style.css" />
    <h1 class="h1">${post.title}</h1>
    <textarea class="input1" id="content" name="content">${post.content}</textarea>
    <div class ="h3">Written by ${post.author}</div>
  `);
}

// function logIn() {
//   return layout(/*html */ `
//     <h1>Log in to your account</h1>
//     <form action="/log-in" method="POST">
//       <label for="email">
//         Your email<span aria-hidden="true">*</span>
//       </label>
//       <input id="author" type="email" name="email" required>
//       <button type="submit">Log in</button>
//     </form>
//   `);
// }

module.exports = { newPost, allPosts, post };
