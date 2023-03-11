const productHelper = require("../../models/admin/product");
const cloudinary = require("../../utils/cloudinary");
const multer = require("multer");
const path = require("path");

upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

module.exports = {
  getProducts: async (req, res) => {
    productHelper.getAllCategory().then((category) => {
      res.render("admin/products", { admin: true, category });
    });
  },
  listProduct: (req, res, next) => {
    productHelper.getProductByCat(req.params.id).then((products) => {
      res.render("admin/product-list", { admin: true, products });
    });
  },
  deleteProduct: (req, res) => {
    let productId = req.params.id;
    productHelper.deleteproduct(productId).then((response) => {
      res.json({ status: true });
    });
  },
  addProduct: async (req, res) => {
    let category = await productHelper.getAllCategory();
    res.render("admin/add-products", { admin: true, category });
  },
  postAdminAddProduct: async (req, res) => {
    const cloudinaryImageUploadMethod = (file) => {
      return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err, res) => {
          console.log(err, " asdfgh");
          if (err) return res.status(500).send("Upload Image Error");
          resolve(res.secure_url);
        });
      });
    };

    const files = req.files;
    let arr1 = Object.values(files);
    let arr2 = arr1.flat();
    const urls = await Promise.all(
      arr2.map(async (file) => {
        const { path } = file;
        const result = await cloudinaryImageUploadMethod(path);
        return result;
      })
    );
    productHelper.addProduct(req.body, urls, (id) => {
      res.redirect("/admin/products");
    });
  },
  editProduct: async (req, res) => {
    let product = await productHelper.getProductDetails(req.params.id);
    let category = await productHelper.getAllCategory();
    res.render("admin/edit-product", { product, category, admin: true });
  },
  postAdminEditProduct: async (req, res) => {
    const cloudinaryImageUploadMethod = (file) => {
      return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err, res) => {
          if (err) return res.status(500).send("Upload Image Error");
          resolve(res.secure_url);
        });
      });
    };
    const files = req.files;
    let arr1 = Object.values(files);
    let arr2 = arr1.flat();
    const urls = await Promise.all(
      arr2.map(async (file) => {
        const { path } = file;
        const result = await cloudinaryImageUploadMethod(path);
        return result;
      })
    );
    productHelper.updateProduct(req.params.id, req.body, urls).then((id) => {
      res.redirect("/admin/products");
    });
  },
  category: (req, res) => {
    res.render("admin/add-category", { admin: true });
  },
  categoryList: (req, res) => {
    productHelper.getAllCategory().then((category) => {
      res.render("admin/category", { admin: true, category });
    });
  },
  postAdminAddCat: async (req, res) => {
    const cloudinaryImageUploadMethod = (file) => {
      return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err, res) => {
          if (err) return res.status(500).send("Upload Image Error");
          resolve(res.secure_url);
        });
      });
    };
    const files = req.files;
    let arr1 = Object.values(files);
    let arr2 = arr1.flat();
    const urls = await Promise.all(
      arr2.map(async (file) => {
        const { path } = file;
        const result = await cloudinaryImageUploadMethod(path);
        return result;
      })
    );
    productHelper.addCategory(req.body, urls).then((id) => {
      if (id) {
        res.render("admin/add-category", { admin: true });
      } else {
        res.render("admin/add-category", {
          admin: true,
          invalid: "Category name Already exists",
        });
      }
    });
  },
  getCatEdit: (req, res) => {
    res.render("admin/edit-category", { admin: true });
  },
  postAdminEditCat: async (req, res) => {
    const cloudinaryImageUploadMethod = (file) => {
      return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err, res) => {
          if (err) return res.status(500).send("Upload Image Error");
          resolve(res.secure_url);
        });
      });
    };
    const files = req.files;
    let arr1 = Object.values(files);
    let arr2 = arr1.flat();
    const urls = await Promise.all(
      arr2.map(async (file) => {
        const { path } = file;
        const result = await cloudinaryImageUploadMethod(path);
        return result;
      })
    );
    productHelper.updateCategory(req.params.id, req.body, urls).then((id) => {
      res.redirect("/admin/category");
    });
  },
  deleteCat: (req, res) => {
    let categoryid = req.params.id;
    productHelper.deleteCategory(categoryid).then((response) => {
      res.json({ status: true });
    });
  },
};
