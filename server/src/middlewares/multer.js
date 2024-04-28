import multer from "multer";

const storageUploads = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirProfile = `src/data/profiles`;
        const dirDocuments = `src/data/documents`;
        if (file.fieldname === "avatar") cb(null, dirProfile)
        else cb(null, dirDocuments); 
    },
    filename: function (req, file, cb) {
        cb(null, req.user.email + "-" + new Date().toDateString() + '-' + file.originalname)
    }
})

const fileExtFilter = function (req, file, cb) {
    const ext = file.mimetype.slice(-4)
    if (ext !== '/png' && ext !== '/jpg' && ext !== '/gif' && ext !== 'jpeg' && ext !== '/pdf' && ext !== '/doc' && ext !== 'docx') {
        cb(new Error('Tipo de archivo no permitido. (png, jpg, gif, jpeg, pdf, doc, docx)'), false);
    }
    cb(null, true)
}

const upload = multer({
    storage: storageUploads,
    fileFilter: fileExtFilter,
})

export const uploadMultiple = upload.fields([
    { name: 'avatar' },
    { name: 'idDoc' },
    { name: 'adressDoc' },
    { name: 'accountDoc' }
]);
