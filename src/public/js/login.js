const urlLogin = "http://localhost:8080/api/sessions/login";

async function postLogin(email, pass) {
    await axios.post(urlLogin, {
        email: email,
        password: pass
    })
        .then(function (response) {
            console.log(response);
            if (response.statusText === "OK") {
                Toastify({
                    text: "Login correcto, bienvenido!.",
                    duration: 2000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    callback: function redirection() {
                            window.location.href = "http://localhost:8080";
                    }
                }).showToast();
            } else {
                Toastify({
                    text: "Datos incorrectos",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "red",
                        color: "black"
                    }
                }).showToast();
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