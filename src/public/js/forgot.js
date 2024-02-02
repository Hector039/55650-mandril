const urlForgot = "http://localhost:8080/api/sessions/forgot";

async function postForgot(email, password) {
    await axios.post(urlForgot, {
        email: email,
        password: password
    })
        .then(function (response) {
            console.log(response);
            if (response.statusText === "OK") {
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
        await postForgot(email, password);
    }
    
});