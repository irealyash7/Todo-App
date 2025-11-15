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
    
     if (resp.data.msg==="Signed in Successfully!"){

     let token=resp.data.token;
     localStorage.setItem("token",token);
        showToast(resp.data.msg, "success");
        showtodos(token);
     }else{showToast(resp.data.msg, "error")}

}

function logout(){

localStorage.removeItem("token");
movetoSignUp()

}

function showtodos(token) {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("todos-container").style.display = "block";

}



















































