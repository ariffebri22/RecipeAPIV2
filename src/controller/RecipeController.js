const xss = require("xss");
const cloudinary = require("../config/cloud");
const multer = require("multer");
const { getRecipe, getRecipeById, deleteById, postRecipe, putRecipe, getRecipeAll, getRecipeCount } = require("../model/RecipeModel");

const RecipeController = {
    getDataDetail: async (req, res, next) => {
        try {
            const { search, searchBy, sort, limit } = req.query;

            const cleanedSearch = xss(search);
            const cleanedSearchBy = xss(searchBy);
            const cleanedSort = xss(sort);
            const cleanedLimit = xss(limit);

            let page = req.query.page || 1;
            let limiter = cleanedLimit || 5;

            const data = {
                search: cleanedSearch || "",
                searchBy: cleanedSearchBy || "title",
                sort: cleanedSort || "asc",
                offset: (page - 1) * limiter,
                limit: limiter,
            };

            const dataRecipe = await getRecipe(data);
            const dataRecipeCount = await getRecipeCount(data);

            const pagination = {
                totalPage: Math.ceil(dataRecipeCount.rows[0].count / limiter),
                totalData: parseInt(dataRecipeCount.rows[0].count),
                pageNow: parseInt(page),
            };

            console.log("dataRecipe");
            console.log(dataRecipe);
            console.log("total data");
            console.log(dataRecipeCount.rows[0].count);

            if (dataRecipe) {
                res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipe.rows, pagination });
            } else {
                res.status(404).json({ status: 404, message: "Recipe data not found", data: [] });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getData: async (req, res, next) => {
        try {
            const dataRecipe = await getRecipeAll();
            console.log("dataRecipe");
            console.log(dataRecipe);
            res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipe.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Invalid id" });
            }

            const dataRecipeId = await getRecipeById(parseInt(id));

            console.log("dataRecipe");
            console.log(dataRecipeId);

            if (!dataRecipeId.rows[0]) {
                return res.status(404).json({ status: 404, message: "Recipe data not found", data: [] });
            }

            res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipeId.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    deleteDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Invalid id" });
            }

            const dataRecipeId = await getRecipeById(parseInt(id));

            const users_id = req.payload.users_Id;
            const type = req.payload.type;

            console.log("id data");
            console.log(users_id);
            console.log(dataRecipeId.rows[0].users_id);
            if (users_id !== dataRecipeId.rows[0].users_id && type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this, except admin." });
            }

            const result = await deleteById(parseInt(id));
            console.log(result);
            if (result.rowCount === 0) {
                throw new Error("Delete data failed");
            }

            res.status(200).json({ status: 200, message: "delete data recipe success", data: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: err.message });
        }
    },
    postData: async (req, res, next) => {
        try {
            const { title, ingredients, category_id } = req.body;

            console.log("post data");
            console.log(title, ingredients, category_id);

            if (!title || !ingredients || !category_id || !req.file) {
                return res.status(400).json({ status: 400, message: "Input title, ingredients, and category_id, photo are required" });
            }

            const imageUrl = req.file.path;
            const users_id = req.payload.users_Id;

            const data = {
                title: xss(title),
                ingredients: xss(ingredients),
                category_id: parseInt(category_id),
                users_id: users_id,
                photo: imageUrl,
            };

            const result = await postRecipe(data);
            console.log(result);

            res.status(200).json({ status: 200, message: "Data resep berhasil ditambahkan", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Terjadi kesalahan pada server" });
        }
    },
    putData: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, ingredients, category_id } = req.body;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Invalid id" });
            }

            const dataRecipeId = await getRecipeById(parseInt(id));

            const imageUrl = req.file ? req.file.path : dataRecipeId.rows[0].photo;
            const users_id = req.payload.users_Id;
            const type = req.payload.type;

            console.log("id data");
            console.log(users_id);
            console.log(dataRecipeId.rows[0].users_id);
            if (users_id !== dataRecipeId.rows[0].users_id && type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this, except admin." });
            }

            console.log("put data");
            console.log(dataRecipeId.rows[0]);

            const data = {
                title: xss(title) || dataRecipeId.rows[0].title,
                ingredients: xss(ingredients) || dataRecipeId.rows[0].ingredients,
                category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
                photo: imageUrl || dataRecipeId.rows[0].photo,
            };

            const result = await putRecipe(data, id);
            console.log(result);

            delete data.id;

            res.status(200).json({ status: 200, message: "update data recipe success", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
};

module.exports = RecipeController;
