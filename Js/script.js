const updateModal = async (post_id) => {
    const post_title = document.getElementById(`post_title_${post_id}`);
    const post_body = document.getElementById(`post_body_${post_id}`);

    const updateModalContent = document.getElementById('updateModalContent');
    updateModalContent.innerHTML = `<div class="modal-header">
        <h5 class="modal-title" id="updateModalLabel">Update Post</h5>
        <button id="btnClose${post_id}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <label for="update_post_title_${post_id}">Title</label>
        <input class="form-control" type="text" name="update_post_title_${post_id}" id="update_post_title_${post_id}" value="${post_title.innerHTML}">
        <label for="update_post_body_${post_id}">Body</label>
        <input class="form-control" type="text" name="update_post_body_${post_id}" id="update_post_body_${post_id}" value="${post_body.innerHTML}">
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" onclick="updatePost(${post_id});" class="btn btn-primary">Update</button>
    </div>`
}

const updatePost = async (post_id) => {
    const update_post_title = document.getElementById(`update_post_title_${post_id}`);
    const update_post_body = document.getElementById(`update_post_body_${post_id}`);
    
    console.log(update_post_title.value);
    console.log(update_post_body.value);

    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${post_id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: update_post_title.value,
                body: update_post_body.value
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const post = await res.json();
        console.log(post);
    } catch {}

    const btnClose = document.getElementById(`btnClose${post_id}`);
    btnClose.click();
    
    const post_title = document.getElementById(`post_title_${post_id}`);
    const post_body = document.getElementById(`post_body_${post_id}`);

    post_title.innerHTML = update_post_title.value;
    post_body.innerHTML = update_post_body.value;

    update_post_title.value = "";
    update_post_body.value = "";
}

const addPost = async () => {
    const add_post_title = document.getElementById('add_post_title');
    const add_post_body = document.getElementById('add_post_body');

    if (add_post_title.value && add_post_body.value) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
            method: "POST",
            body: JSON.stringify({
                userId: 1,
                title: add_post_title.value,
                body: add_post_body.value
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const post = await res.json();
        console.log(post);

        const btnClose = document.getElementById('btnCloseAdd');
        btnClose.click();

        const postsContainer = document.getElementById('postsContainer');
        const div = document.createElement('div');

        div.classList.add('Card');
        div.classList.add('m-5');

        div.innerHTML = `<div class="card">
                            <h5 class="card-header row">
                                <div class="col-sm-3">Featured</div> 
                                <div class="edit-div col-sm-9">
                                    <button onclick="updateModal(${post.id});" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateModal">
                                        Update
                                    </button>
                                    <button onclick="deletePost(event, ${post.id});" class="btn btn-danger">Delete</button>
                                </div>
                            </h5>
                            <div class="card-body">
                                <h5 id="post_title_${post.id}" class="card-title">${post.title}</h5>
                                <p id="post_body_${post.id}" class="card-text">${post.body}</p>
                            </div>
                        </div>`;

        postsContainer.prepend(div);

        add_post_title.value = "";
        add_post_body.value = "";
    } else {
        alert("Please enter valid details!");
    }
}

const deletePost = async (event, post_id) => {
    if (confirm("Are you sure you want to delete this post?")) {
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${post_id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            const post = await res.json();
            console.log(post);   
        } catch {}

        event.target.parentElement.parentElement.parentElement.parentElement.remove();
    }
}

const fetchPosts = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();

    if (posts) {
        const postsContainer = document.getElementById('postsContainer');

        const postsContent = Array.from(posts).map(post =>
                `<div class="Card m-5">
                    <div class="card">
                        <h5 class="card-header row">
                            <div class="col-sm-3">Featured</div> 
                            <div class="edit-div col-sm-9">
                                <button onclick="updateModal(${post.id});" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateModal">
                                    Update
                                </button>
                                <button onclick="deletePost(event, ${post.id});" class="btn btn-danger">Delete</button>
                            </div>
                        </h5>
                        <div class="card-body">
                            <h5 id="post_title_${post.id}" class="card-title">${post.title}</h5>
                            <p id="post_body_${post.id}" class="card-text">${post.body}</p>
                        </div>
                    </div>
                </div>`
        ).join('')

        postsContainer.innerHTML = postsContent;
    } else {
        console.log("Some Error Occured!");
    }
}

fetchPosts();

const search = document.getElementById('search');
search.addEventListener('input', () => {
    const cards = document.getElementsByClassName('Card');
    Array.from(cards).forEach(element => {
        const cardTitle = element.querySelector('.card-title');
        if (cardTitle.innerText.includes(search.value)) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    })
})