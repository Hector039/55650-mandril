const urlSignin = "http://localhost:8080/signin";

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
                window.location.href = "http://localhost:8080/home";
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

    await postSignup(firstName, lastName, email, password, repassword);
});