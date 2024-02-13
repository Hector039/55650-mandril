const urlLogin = "http://localhost:8080/api/sessions/login";

async function postLogin(email, pass) {
    await axios.post(urlLogin, {
        email: email,
        password: pass
    })
        .then(function (response) {
            if (response.data.status === "Success") {
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

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await postLogin(email, password);
});

window.fbAsyncInit = function () {
    FB.init({
        appId: '405107685391557',
        cookie: true,
        xfbml: true,
        version: 'v8.0'
    });

    FB.AppEvents.logPageView();

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function onLogin() {
    FB.login((response) => {
        if (response.authResponse) {
            FB.api("/me?fields=email,name,picture"), (response) => {
                console.log(response);
            }
        }
    }) 
}