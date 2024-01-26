
export default function auth(req, res, next) {

    if (!req.session || req.session.role !== "admin") {
        return res.sendStatus(401);
    };

    return next();
};