const urlForgot = "http://localhost:8080/api/sessions/forgot";

async function postForgot(email, password) {
    await axios.post(urlForgot, {
        email: email,
        password: password
    })
        .then(function (response) {
            console.log(response);
            if (response.statusText === "OK") {
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
                
            } else {
                Toastify({
                    text: "Datos incorrectos.",
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