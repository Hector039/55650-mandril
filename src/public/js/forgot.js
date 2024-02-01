const urlForgot = "http://localhost:8080/forgot";

async function postForgot(email, pass) {
    await axios.post(urlLogin, {
        email: email,
        password: pass
    })
        .then(function (response) {
            console.log(response);
            if (response.statusText === "ok") {
                window.location.href = "http://localhost:8080/login";
            } else {
                alert("Datos incorrectos");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

const loginFormForgot = document.getElementById("login-form");

loginFormForgot.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;

    if (password !== repassword) {
        alert("Las contraseñas no coinciden, intenta nuevamente.")
    } else {
        await postLogin(email, password);
    }
    
});