export const isSessionOn = () => {//middleware para evitar volver al login o signin cuando está el usuario logueado con jwt
    return async (req, res, next) => {
        const token = req.cookies.cookieToken;
        if (token === undefined) {
            next();
        } else {
            res.redirect("/");
        }
    }
}