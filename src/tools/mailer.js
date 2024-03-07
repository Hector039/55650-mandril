import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "elector22@gmail.com",
        pass: "fuwd ombp qzdt blzr"
    }
})

export default async function mailer(user, message) {
    try {
        if(user.name === null || user.mail === null || message === null) {
            return "Error o falta de datos de usuario. No se envió el email."
        }
        await transport.sendMail({
            from: "Coder Test elector22@gmail.com",
            to: user.mail,
            subject: `Bienvenido ${user.name}!`,
            html: `
            <div>
            <h1>${message}</h1>
            <img src="cid:logo"/>
            </div>
            `,
            attachments: [{
                filename: "logo.jpg",
                path: "/logo.jpg",
                cid: "logo"
            }]
        });
        return "emailSent";
    } catch (error) {
        throw error;
    }
}
