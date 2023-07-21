const Pool = require("../config/db");
const { getUsers, getUsersAll, getUsersCount, getUsersById, deleteUsersById, postUsers, putUsers, getLogin } = require("../model/UsersModel");
const { hash, verify } = require("../helper/passwordHash");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const argon2 = require("argon2");

const secretKey = process.env.SECRET_KEY || "mySecretKey";

const UsersController = {
    getDataDetail: async (req, res, next) => {
        try {
            const { search, searchBy, sort, limit } = req.query;

            let page = req.query.page || 1;
            let limiter = limit || 5;

            const data = {
                search: search || "",
                searchBy: searchBy || "username",
                sort: sort || "asc",
                offset: (page - 1) * limiter,
                limit: limit || 5,
            };

            const dataUsers = await getUsers(data);
            const dataUsersCount = await getUsersCount(data);

            const pagination = {
                totalPage: Math.ceil(dataUsersCount.rows[0].count / limiter),
                totalData: parseInt(dataUsersCount.rows[0].count),
                pageNow: parseInt(page),
            };

            console.log("dataUsers");
            console.log(dataUsers);
            console.log("total data");
            console.log(dataUsersCount.rows[0].count);

            res.status(200).json({ status: 200, message: "get data users success", data: dataUsers.rows, pagination });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getData: async (req, res, next) => {
        try {
            const dataUsers = await getUsersAll();
            console.log("dataUsers");
            console.log(dataUsers);
            res.status(200).json({ status: 200, message: "get data users success", data: dataUsers });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            const dataUsersId = await getUsersById(parseInt(id));

            console.log("dataUsers");
            console.log(dataUsersId);

            if (!dataUsersId.rows[0]) {
                return res.status(200).json({ status: 200, message: "get data users not found", data: [] });
            }

            return res.status(200).json({ status: 200, message: "get data users success", data: dataUsersId.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    deleteDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            const result = await deleteUsersById(parseInt(id));
            console.log(result);

            if (result.rowCount == 0) {
                throw new Error("delete data failed");
            }

            return res.status(200).json({ status: 200, message: "delete data users success", data: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: err.message });
        }
    },
    postData: async (req, res, next) => {
        try {
            const { username, password, email } = req.body;
            console.log("post data ");
            console.log(username, password, email);

            if (!username || !password || !email) {
                return res.status(400).json({ status: 400, message: "input username password email required" });
            }

            const hashedPassword = await hash(password);

            console.log("data");
            const data = {
                username: username,
                password: hashedPassword,
                email: email,
            };

            console.log(data);
            const result = await postUsers(data);
            console.log(result);

            const token = jwt.sign({ username: username }, secretKey);

            res.status(200).json({ status: 200, message: "data users success", data, token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    putData: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { username, password, email } = req.body;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            const dataUsersId = await getUsersById(parseInt(id));

            console.log("put data");
            console.log(dataUsersId.rows[0]);

            const data = {
                username: username || dataUsersId.rows[0].username,
                password: password || dataUsersId.rows[0].password,
                email: email || dataUsersId.rows[0].email,
                id,
            };

            // Hash password baru jika ada
            if (password) {
                data.password = await hash(password);
            }

            const result = await putUsers(data);
            console.log(result);

            delete data.id;

            return res.status(200).json({ status: 200, message: "update data users success", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },

    login: async (req, res, next) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ status: 400, message: "input username and password required" });
            }

            const dataUsers = await getLogin({ username });

            if (dataUsers && dataUsers.rows.length > 0) {
                const storedPassword = dataUsers.rows[0].password;
                // const newPassword = storedPassword.join("");

                if (typeof storedPassword === "string" && typeof password === "string") {
                    const isPasswordValid = await verify(storedPassword, password);
                    if (isPasswordValid) {
                        const token = jwt.sign({ username: username, userId: dataUsers.rows[0].id }, secretKey);

                        return res.status(200).json({ status: 200, message: `Login successful`, say: `Hallo ${username}!`, token });
                    } else {
                        return res.status(401).json({ status: 401, message: "Invalid password" });
                    }
                } else {
                    // console.log(storedPassword);
                    return res.status(500).json({ status: 500, message: "Internal server error: Invalid password format" });
                }
            } else {
                return res.status(404).json({ status: 404, message: "User not found" });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
};

module.exports = UsersController;
