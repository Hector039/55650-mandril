const socket = io();

const url = "http://localhost:8080/chat";
const urlSession = "http://localhost:8080/session";
let user = "";

Swal.fire({
    title: "Inicia sesion!",
    text: "Ingresa tu email",
    input: "email",
    confirmButtonText: "Cool",
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "Debe ingresar un email válido";
        }
    },
}).then((result) => {
    if (result.value) {
        const email = result.value;

        axios.post(url, {
            email
        }).then(response => {
            console.log(response);
        }).catch(e => {
            console.log(e);
        });

    }
});

socket.on("new-user", (data) => {

    console.log("nuevo cliente conectado", data.user);
    user = data.user

    const chatLogs = document.getElementById("chat-window");

    let message = "";

    data.messages.forEach((elem) => {
        message += `
    
        <div class="chat-message">
        <div class="message-bubble">

        <div class="message-sender" >${elem.user}</div>
        <p>${elem.message}</p>
        </div>

        </div>
    `;
    });

    chatLogs.innerHTML = message;

});

const chatBox = document.getElementById("chatBox");

chatBox.addEventListener("keyup", async (e) => {

    const message = document.getElementById("chatBox").value;

    if (e.key === "Enter") {

        await axios.post(url, {
            email: user,
            message: message
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        chatBox.value = "";
    }
});

socket.on("new-user-connected", (data) => {
        Swal.fire({
            text: `${data.user} se ha conectado al chat`,
            toast: true,
            position: "top-end",
            timer: 2000
        });
});

socket.on("messages-log", (data) => {

    const messagesLogs = document.getElementById("chat-window");

    let message = "";

    data.forEach((elem) => {
        message += `
    
        <div class="chat-message">
        <div class="message-bubble">

        <div class="message-sender" >${elem.user}</div>
        <p>${elem.message}</p>
        </div>

        </div>
    `;
    });

    messagesLogs.innerHTML = message;
});