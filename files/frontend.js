window.onload = function () {
    let token = localStorage.getItem("token");

    if (token) {
        showtodos(token);
    } else {
        movetoSignUp();
    }
};

function movetoSignIn() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "block";
    document.getElementById("todos-container").style.display = "none";
}

function movetoSignUp() {
    document.getElementById("signup-container").style.display = "block";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("todos-container").style.display = "none";
}
async function register() {
    let username = document.getElementById("rusername").value
    let password = document.getElementById("rpassword").value

    let resp = await axios.post("http://localhost:3000/signup", { username, password })

    if (resp.data.msg === "User registered successfully!") {
        showToast(resp.data.msg, "success");
        movetoSignIn()
    } else { showToast(resp.data.msg, "error") }

}

function showToast(message, type) {
    const toast = document.getElementById("toast");
    toast.textContent = message;

    if (type === "success") toast.style.background = "#28a745";
    else if (type === "error") toast.style.background = "#dc3545";
    else if (type === "info") toast.style.background = "#007bff";

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

async function login() {

    let username = document.getElementById("susername").value;
    let password = document.getElementById("spassword").value;

    let resp = await axios.post("http://localhost:3000/signin", { username, password })

    if (resp.data.msg === "Signed in Successfully!") {

        let token = resp.data.token;
        localStorage.setItem("token", token);
        showToast(resp.data.msg, "success");
        showtodos(token);
    } else { showToast(resp.data.msg, "error") }

}

function logout() {

    localStorage.removeItem("token");
    movetoSignUp()

}

function showtodos() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("todos-container").style.display = "block";
    getTodos()
}

async function getTodos() {

    let token = localStorage.getItem("token")

    try {

        let response = await axios.get("http://localhost:3000/todos", {
            headers: { token },
        });

        const todosList = document.getElementById("todos-list");


        todosList.innerHTML = "";


        if (response.data.todos.length) {
            response.data.todos.forEach((todo) => {
                let todoElement = createTodoElement(todo);
                todosList.appendChild(todoElement);
            });
        }
    } catch (error) {
        console.error("Error while getting To-Do list:", error);
    }
}

async function addTodo() {
    const inputElement = document.getElementById("input-todo");
    const title = inputElement.value;

    if (title.trim() === "") {
        alert("Please write something to add to the To-Do list.");
        return;
    }

    try {
        const token = localStorage.getItem("token");

        await axios.post(
            "http://localhost:3000/todos",
            {
                title
            }, { headers: { token } }
        );

        inputElement.value = "";

        getTodos();
    } catch (error) {
        console.error("Error while adding a new To-Do item:", error);
    }
}

async function updateTodo(id, newTitle) {
    const token = localStorage.getItem("token");

    try {
        await axios.put(
            `http://localhost:3000/todos`,
            {
                title: newTitle,
                id
            }, { headers: { token } }
        );

        getTodos();
    } catch (error) {
        console.error("Error while updating a To-Do item:", error);
    }
}

async function deleteTodo(id) {
    const token = localStorage.getItem("token");

    try {
        await axios.delete("http://localhost:3000/todos", {
            headers: { token },
            data: { id }
        });

        getTodos(token);
    } catch (error) {
        console.error("Error while deleting a To-Do item:", error);
    }
}


async function toggleTodoDone(id) {
    const token = localStorage.getItem("token");

    try {
        await axios.put(`http://localhost:3000/todos/done`, {
            id
        }, { headers: { token } })

        getTodos();
    } catch (error) {
        console.error("Error while toggling To-Do status:", error);
    }
}

function createTodoElement(todo) {
    const todoDiv = document.createElement("div");
    todoDiv.className = "todo-item";

    const inputElement = createInputElement(todo.title);
    inputElement.readOnly = true;

    const updateBtn = createUpdateButton(inputElement, todo._id.toString());
    const deleteBtn = createDeleteButton(todo._id.toString());
    const doneCheckbox = createDoneCheckbox(todo.done, todo._id.toString(), inputElement);

    todoDiv.appendChild(inputElement);
    todoDiv.appendChild(doneCheckbox);
    todoDiv.appendChild(updateBtn);
    todoDiv.appendChild(deleteBtn);

    return todoDiv;
}

function createDoneCheckbox(done, id, inputElement) {

    const doneCheckbox = document.createElement("input");
    doneCheckbox.type = "checkbox";
    doneCheckbox.checked = done;

    inputElement.style.textDecoration = done ? "line-through" : "none";

    doneCheckbox.onchange = function () {

        toggleTodoDone(id, done);
        inputElement.style.textDecoration = doneCheckbox.checked ? "line-through" : "none";
    };

    return doneCheckbox;
}


function createDeleteButton(id) {

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";


    deleteBtn.onclick = function () {

        deleteTodo(id);
    };

    return deleteBtn;
}

function createUpdateButton(inputElement, id) {

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Edit";


    updateBtn.onclick = function () {
        if (inputElement.readOnly) {

            inputElement.readOnly = false;
            updateBtn.textContent = "Save";
            inputElement.focus();
            inputElement.style.outline = "1px solid #007BFF";
        } else {

            inputElement.readOnly = true;
            updateBtn.textContent = "Edit";
            inputElement.style.outline = "none";

            updateTodo(id, inputElement.value);
        }
    };

    return updateBtn;
}

function createInputElement(value) {

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = value;
    inputElement.readOnly = true;

    return inputElement;
}








































