const express = require("express");
const { join } = require("path");
const multer = require("multer");
const { writeFile, readFile } = require("fs-extra");
const router = express.Router();
const upload = multer({})

const uploadFolder = join(__dirname, "../../public/images");

router.post('/:id/upload', upload.single('images'), async (req, res) => {
    if(req.file) {
        res.json(req.file);
        const fileName = req.params.id + ".jpg"
        await writeFile(join(uploadFolder, fileName), req.file.buffer);
    }
    else throw 'error';
});

module.exports = router;