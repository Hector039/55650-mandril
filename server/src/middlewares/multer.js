import multer from "multer";

const storageUploads = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirProfile = `src/data/profiles`;
        const dirDocuments = `src/data/documents`;
        const dirProducts = `src/data/products`;
        if (file.fieldname === "avatar") return cb(null, dirProfile)
        if (file.fieldname === "prodPic") return cb(null, dirProducts)
        cb(null, dirDocuments);
    },
    filename: function (req, file, cb) {
        cb(null, req.user.email + "-" + new Date().toDateString() + '-' + file.originalname)
    }
})

const fileExtFilter = function (req, file, cb) {
    try {
        const ext = file.mimetype.slice(-4)
        if (file && (file.fieldname === "avatar" || file.fieldname === "prodPic") && ext !== '/png' && ext !== '/jpg' && ext !== '/gif' && ext !== 'jpeg') {
            cb(new Error("Imagen no reconocida. (png, jpg, gif, jpeg)"))
            return
        } else if (file && ext !== '/pdf' && ext !== '/doc' && ext !== 'docx' && ext !== '/png' && ext !== '/jpg' && ext !== '/gif' && ext !== 'jpeg') {
            cb(new Error("Tipo de archivo no permitido. (pdf, doc, docx, png, jpg, gif, jpeg)"))
            return
        }
        cb(null, true)
    } catch (error) {
        cb(error, null)
    }

}

export const uploads = multer({ fileFilter: fileExtFilter, storage: storageUploads })
