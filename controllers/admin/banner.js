const bannerHelper = require('../../models/admin/banner')
const cloudinary = require('../../utils/cloudinary')
const multer = require('multer')
const path = require('path');

upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
            cb(new Error("File type is not supported"), false)
            return
        }
        cb(null, true)
    }
})

module.exports = {
    getBanner: async (req, res) => {
        try {
            let bannerData = await bannerHelper.getImageBanner()
            let userBanner = await bannerHelper.userBanner()
            res.render('admin/banner',{ bannerData,userBanner})
        } catch (err) {
            console.log(err);
            res.status(404).render('404')
        }
    },
    addImage: async (req, res) => {
        const cloudinaryImageUploadMethod = (file) => {
            return new Promise((resolve) => {
                cloudinary.uploader.upload(file, (err, res) => {
                    if (err) return res.status(500).send("Upload Image Error")
                    resolve(res.secure_url)
                })
            })
        }
        const files = req.files
        let arr1 = Object.values(files)
        let arr2 = arr1.flat()
        const urls = await Promise.all(
            arr2.map(async (file) => {
                const { path } = file
                const result = await cloudinaryImageUploadMethod(path)
                return result
            })
        )
        bannerHelper.addImage(req.body, urls).then((id) => {
            if (id) {
                res.redirect('/admin/banner')
            }
            else {
                res.render({ invalid: 'image not uploaded' })
            }
        })

    },
    setBannerFirst: (req, res) => {
        try {
            bannerHelper.setBannerFirst(req.params.id).then((response) => {
                res.json({})
            })
        } catch {
            res.status(404).render('404')
        }

    },
    setBannerSecond: (req, res) => {
        try {
            bannerHelper.setBannerSecond(req.params.id).then((response) => {
                res.json({})
            })
        } catch {
            res.status(404).render('404')
        }
    },
    setBannerThird: (req, res) => {
        try {
            bannerHelper.setBannerThird(req.params.id).then((response) => {
                res.json({})
            })
        } catch {
            res.status(404).render('404')
        }
    },
    deleteBanner:(req,res)=>{
        try{
            bannerHelper.deleteBanner(req.params.id).then(()=>{
                res.json({})
            })
        }catch{
            res.status(404).render('404')
        }
    },
    deleteBannerU:(req,res)=>{
        try{
            bannerHelper.deleteBannerU(req.params.id).then(()=>{
                res.json({})
            })
        }catch{
            res.status(404).render('404')
        }
    }
    
}