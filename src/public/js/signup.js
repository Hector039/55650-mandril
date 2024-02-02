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
                window.location.href = "http://localhost:8080";
            } else {
                alert("Datos incorrectos");
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
        alert("Las contraseñas no coinciden, intenta nuevamente.")
    } else {
        await postSignup(firstName, lastName, email, password, repassword);
    }
});