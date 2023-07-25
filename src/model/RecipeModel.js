const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const cloudinary = require("../config/cloud");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// const Recipe = sequelize.define("recipe", {
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     ingredients: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     photo: {
//         type: DataTypes.STRING, // Menyimpan URL gambar di Cloudinary
//         allowNull: true,
//     },
//     category_id: {
//         type: DataTypes.INTEGER, // Foreign key dari tabel category
//         allowNull: false,
//     },
//     users_id: {
//         type: DataTypes.INTEGER, // Foreign key dari tabel users
//         allowNull: false,
//     },
// });

// // Konfigurasi Multer untuk upload foto
// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png/;
//         const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = fileTypes.test(file.mimetype);
//         if (extname && mimetype) {
//             return cb(null, true);
//         } else {
//             cb("Error: Only images of type jpeg/jpg/png are allowed!");
//         }
//     },
//     limits: {
//         fileSize: 1024 * 1024 * 2.5, // 2.5 MB
//     },
// });

// // Fungsi untuk meng-upload foto ke Cloudinary dengan bantuan Sharp dan menyimpan URL di model
// Recipe.uploadPhoto = upload.single("photo");

// Recipe.beforeCreate(async (recipe) => {
//     if (recipe.photo && recipe.photo.buffer) {
//         try {
//             const uploadedImage = await sharp(recipe.photo.buffer).resize({ width: 600, height: 400 }).toFormat("jpeg").jpeg({ quality: 90 }).toBuffer();

//             const cloudinaryResult = await cloudinary.uploader.upload_stream({ folder: "RecipeAPIV2" }, async (error, result) => {
//                 if (error) {
//                     console.error(error);
//                     throw new Error("Failed to upload photo to Cloudinary");
//                 }

//                 recipe.photo = result.secure_url;
//             });

//             uploadedImage.pipe(cloudinaryResult);
//         } catch (error) {
//             console.error(error);
//             throw new Error("Failed to upload photo to Cloudinary");
//         }
//     }
// });

const getRecipeAll = async () => {
    console.log("model getRecipe");
    return new Promise((resolve, reject) =>
        sequelize.query(
            `SELECT re.id, re.title, re.ingredients, re.photo, cat.name AS category, us.username AS creator
            FROM recipe re
            JOIN category cat ON re.category_id = cat.id
            JOIN users us ON re.users_id = us.id
            ORDER BY re.id;`,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            }
        )
    );
};

const getRecipe = async (data) => {
    const { search, searchBy, sort, offset, limit } = data;
    console.log("model getRecipe", search, searchBy, sort, offset, limit);
    return new Promise((resolve, reject) =>
        sequelize.query(
            `SELECT re.id, re.title, re.ingredients, re.photo, cat.name AS category, us.username AS creator
            FROM recipe re
            JOIN category cat ON re.category_id = cat.id
            JOIN users us ON re.users_id = us.id
            WHERE ${searchBy} ILIKE '%${search}%' ORDER BY re.id ${sort} OFFSET ${offset} LIMIT ${limit} `,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            }
        )
    );
};

const getRecipeCount = async (data) => {
    const { search, searchBy, sort, offset, limit } = data;
    console.log("model getRecipe", search, searchBy, sort, offset, limit);
    return new Promise((resolve, reject) =>
        sequelize.query(`SELECT COUNT(*) FROM recipe re JOIN category cat ON re.category_id = cat.id JOIN users us ON re.users_id = us.id WHERE ${searchBy} ILIKE '%${search}%'`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const postRecipe = async (data) => {
    const { title, ingredients, category_id, users_id } = data;
    console.log(data);
    console.log("model postRecipe");
    return new Promise((resolve, reject) =>
        sequelize.query(`INSERT INTO recipe(title,ingredients,category_id,photo,users_id) VALUES('${title}','${ingredients}',${category_id},'https://placehold.co/600x400', ${users_id})`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const putRecipe = async (data, id) => {
    const { title, ingredients, category_id } = data;
    console.log("model postRecipe");
    return new Promise((resolve, reject) =>
        sequelize.query(`UPDATE recipe SET title='${title}', ingredients='${ingredients}', category_id = ${category_id} WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getRecipeById = async (id) => {
    console.log("model recipe by id ->", id);
    return new Promise((resolve, reject) =>
        sequelize.query(`SELECT * FROM recipe WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const deleteById = async (id) => {
    console.log("delete recipe by id ->", id);
    return new Promise((resolve, reject) =>
        sequelize.query(`DELETE FROM recipe WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

module.exports = {
    getRecipe,
    getRecipeById,
    deleteById,
    postRecipe,
    putRecipe,
    getRecipeAll,
    getRecipeCount,
    // Recipe, // Ekspor model Recipe
};
