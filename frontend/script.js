let isSignedUp = false;
let BASE_URL = "http://localhost";
let PORT = 3000;

const signUpForm = document.getElementById("signup-form");
signUpForm.addEventListener("submit", async () => {
    if(isSignedUp) {
        document.getElementById("response-message").innerText = "Already signed up";
        return;
    }
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    try {
        const response = await fetch(`${BASE_URL}:${PORT}/user/signup`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const result = await response.json();
        console.log(result);

        if(response.ok) {
            isSignedUp = true;
            document.getElementById("response-message").innerText = result.message || "Signup successful, please sign in!";
            document.getElementById("signup-container").style.display = "none";
            document.getElementById("signin-container").style.display = "block";
        } else {
            document.getElementById("response-message").innerText = result.message || "Signup failed";
        }
        
    } catch(error) {
        console.error(error);
        document.getElementById("response-message").innerText = "Error during signup!";
    }
});

const signInForm = document.getElementById("signin-form");
signInForm.addEventListener("submit", async () => {
    const email = document.getElementById("signin-username").value;
    const password = document.getElementById("signin-password").value;
    console.log(email, password);

    try {
        const response = await fetch(`${BASE_URL}:${PORT}/user/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })   
        });

        const result = await response.json();
        console.log(result);

        if(response.ok) {
            localStorage.setItem("token", result.token);
            document.getElementById("signin-container").style.display = "none";
            document.getElementById("todo-container").style.display = "block";
            document.getElementById("response-message").innerHTML = "Logged in successfully.";
            loadTodos();

            // add event listener to the logout button
            document.getElementById("logout-button").addEventListener("click", () => {
                document.getElementById("todo-container").style.display = "none";
                document.getElementById("signin-container").style.display = "block";
                document.getElementById("response-message").innerText = "Logged out";
            });
        } else {
            document.getElementById("response-message").innerText = result.message || "Sigin failed!";
        }
    } catch(error) {
        console.log(error);
        document.getElementById("response-message").innerText = "Error during signin!";
    }
});

const todoForm = document.getElementById("todo-form");
todoForm.addEventListener("submit", async () => {
    const todoInput = document.getElementById("todo-input");
    const todoItem = todoInput.value.trim();

    if(!todoItem) {
        document.getElementById("response-message").innerText = "Todo item cannot be empty!";
        return;
    }
    
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}:${PORT}/todo/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify({
                taskTitle: todoItem
            })
        });

        const result = await response.json();

        if(response.ok) {
            todoInput.innerText = "";
            loadTodos();
            document.getElementById("response-message").innerText = "Added";
        } else {
            document.getElementById("response-message").innerText = result.message || "Something went wrong";
        }
    } catch(error) {
        console.error(error);
        document.getElementById("response-message").innerText = "Failed to insert a todo";
    }
});

async function loadTodos() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}:${PORT}/todo`, {
            method: "GET",
            headers: {
                "authorization": token
            }
        });
        const result = await response.json();
        const todos = result.data;

        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        todos.forEach(todo => {
            const li = document.createElement("li");
            li.textContent = todo.title;

            if(todo.done) {
                li.style.textDecoration = "line-through";
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                deleteTodo(todo._id);
            }

            li.appendChild(deleteButton);

            const completeButton = document.createElement("button");
            completeButton.textContent = "Complete";
            completeButton.onclick = () => {
                completeTodo(todo._id, true);
            }

            if (!todo.completed) {
                li.appendChild(completeButton);
            }

            todoList.appendChild(li);
        });
    } catch(error) {
        console.log("Error loading todos: ", error);
    }
}

async function completeTodo(id, done) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}:${PORT}/todo/update/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify({
                done
            })
        });

        if(response.ok) {
            document.getElementById("response-message").innerText = "Update Successful.";
            loadTodos();
        } else {
            document.getElementById("response-message").innerText = "Update Failed";
        }
    } catch(error) {
        console.error("Couldn't complete todo. ", error);
    }
}

async function deleteTodo(id) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}:${PORT}/todo/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        });
        const result = await response.json();
        console.log(result);

        if(response.ok) {
            document.getElementById("response-message").innerText = result.message;
            loadTodos();
        } else {
            document.getElementById("response-message").innerText = result.message;
        }
    } catch(error) {
        console.error("Couldn't delete todo");
    }
}

// Toggle between Signup and Signin
document.getElementById('show-signin').addEventListener('click', () => {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('signin-container').style.display = 'block';
});

document.getElementById('show-signup').addEventListener('click', () => {
    document.getElementById('signin-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
});