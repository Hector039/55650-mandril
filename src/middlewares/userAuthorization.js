export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "No autorizado" });
        if (req.user.role != role) return res.status(403).send({ error: "Sin permisos" });
        next();
    }
}