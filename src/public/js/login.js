const urlLogin = "http://localhost:8080/api/sessions/login";

async function postLogin(email, pass) {
    await axios.post(urlLogin, {
        email: email,
        password: pass
    })
        .then(function (response) {
            console.log(response);
            if (response.statusText === "OK") {
                window.location.href = "http://localhost:8080";
            } else {
                alert("Datos incorrectos");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await postLogin(email, password);
});