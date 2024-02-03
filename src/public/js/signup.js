const urlSignin = "http://localhost:8080/api/sessions/signin";

async function postSignup(firstname, lastname, email, password, repassword) {
    await axios.post(urlSignin, {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password,
        repassword: repassword
    })
        .then(function (response) {
            if (response.statusText === "Created") {
                Toastify({
                    text: "Registro correcto, bienvenido!.",
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
};

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
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
        await postSignup(firstName, lastName, email, password, repassword);
    }
});