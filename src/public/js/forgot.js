const urlForgot = "http://localhost:8080/api/sessions/forgot";

async function postForgot(email, password) {
    await axios.post(urlForgot, {
        email: email,
        password: password
    })
        .then(function (response) {
            if (response.data.status === "Success") {
                Toastify({
                    text: "Se restauró la contraseña correctamente.",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    callback: function redirection() {
                            window.location.href = "http://localhost:8080/login";
                    }
                }).showToast();
            }
        })
        .catch(function (error) {
            if (error.response.data.status === "ServerError") {
                Toastify({
                    text: "Problema de servidor",
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
            if (error.response.data.status === "UserError") {
                Toastify({
                    text: "Usuario o contraseña incorrectos",
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
        });
}

const loginFormForgot = document.getElementById("login-form");

loginFormForgot.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;

    if (password !== repassword) {
        Toastify({
            text: "Las contraseñas no coinciden, intenta nuevamente.",
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
    } else {
        await postForgot(email, password);
    }
    
});