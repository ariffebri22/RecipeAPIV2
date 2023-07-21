const xss = require("xss");
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
            let limiter = limit || 5;

            data = {
                search: cleanedSearch || "",
                searchBy: cleanedSearchBy || "title",
                sort: cleanedSort || "asc",
                offset: (page - 1) * limiter,
                limit: cleanedLimit || 5,
            };
            let dataRecipe = await getRecipe(data);
            let dataRecipeCount = await getRecipeCount(data);

            let pagination = {
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
            }
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getData: async (req, res, next) => {
        try {
            let dataRecipe = await getRecipeAll();
            console.log("dataRecipe");
            console.log(dataRecipe);
            if (dataRecipe) {
                res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipe.rows });
            }
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            let dataRecipeId = await getRecipeById(parseInt(id));

            console.log("dataRecipe");
            console.log(dataRecipeId);

            if (!dataRecipeId.rows[0]) {
                return res.status(200).json({ status: 200, message: "get data recipe not found", data: [] });
            }

            return res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipeId.rows[0] });
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    deleteDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            let result = await deleteById(parseInt(id));
            console.log(result);
            if (result.rowCount == 0) {
                throw new Error("delete data failed");
            }
            return res.status(200).json({ status: 200, message: "delete data recipe success", data: result.rows[0] });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    },
    postData: async (req, res, next) => {
        try {
            const { title, ingredients, category_id } = req.body;
            console.log("post data ");
            console.log(title, ingredients, category_id);

            if (!title || !ingredients || !category_id) {
                return res.status(400).json({ status: 400, message: "input title ingredients category_id required" });
            }
            let data = {
                title: title,
                ingredients: ingredients,
                category_id: parseInt(category_id),
            };

            console.log("data");
            console.log(data);
            let result = postRecipe(data);
            console.log(result);

            return res.status(200).json({ status: 200, message: "data recipe success", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    putData: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, ingredients, category_id } = req.body;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            let dataRecipeId = await getRecipeById(parseInt(id));

            console.log("put data");
            console.log(dataRecipeId.rows[0]);

            let data = {
                title: title || dataRecipeId.rows[0].title,
                ingredients: ingredients || dataRecipeId.rows[0].ingredients,
                category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
            };

            let result = putRecipe(data, id);
            console.log(result);

            delete data.id;

            return res.status(200).json({ status: 200, message: "update data recipe success", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
};

module.exports = RecipeController;
