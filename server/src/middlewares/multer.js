import multer from "multer";

const storageUploads = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirProfile = `src/data/profiles`;
        const dirDocuments = `src/data/documents`;
        if (file.fieldname === "avatar") return cb(null, dirProfile)
        cb(null, dirDocuments);
    },
    filename: function (req, file, cb) {
        cb(null, req.user.email + "-" + new Date().toDateString() + '-' + file.originalname)
    }
})

const fileExtFilter = function (req, file, cb) {
    try {
        const ext = file.mimetype.slice(-4)
        if (file && file.fieldname === "avatar" && ext !== '/png' && ext !== '/jpg' && ext !== '/gif' && ext !== 'jpeg') {
            cb(new Error("Foto de perfil no reconocida. (png, jpg, gif, jpeg)"))
            return
        }  else if (file && ext !== '/pdf' && ext !== '/doc' && ext !== 'docx' && ext !== '/png' && ext !== '/jpg' && ext !== '/gif' && ext !== 'jpeg') {
            cb(new Error("Tipo de archivo no permitido. (pdf, doc, docx, png, jpg, gif, jpeg)"))
            return
        }
        cb(null, true)
    } catch (error) {
        cb(error, null)
    }

}

export const uploads = multer({ fileFilter: fileExtFilter, storage: storageUploads })
