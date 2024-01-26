var express = require("express");
const db = require("../database");
var router = express.Router();

router.get("/", async function (req, res) {
    const result = await db.query("SELECT * FROM entries;");
    res.send(result.rows);
});

router.post("/", async function (req, res) {
 
    const { title, value, type , cattitle} = req.body;

    const errors1 = [];
    if (title.length < 5) {
        errors1.push("Title is too short");
    }
    if (cattitle.length < 5) {
        errors1.push("Title is too short");
    }
    if (value < 0) {
        errors1.push("Value must be positive");
    }
    if (!["income", "expense"].includes(type)) {
        errors1.push("Invalid type - please use expense or income");
    }

    if (errors1.length > 0) {
        return res.status(400).send({
            errorType: "VALIDATION_ERROR",
            errors1,
        });
    }

    const result = await db.query(
        `INSERT INTO entries (title, value, type, cattitle) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [title, value, type,cattitle]
    );

    res.send(result.rows[0]);
});

router.get("/:id", async function (req, res){
    const entryId = req.params.id;
    console.log(entryId)

    const result = await db.query("SELECT * FROM entries WHERE id = $1;", [entryId]);

    if (result.rows.length === 0) {
        return res.status(404).send({
            errorType: "NOT_FOUND_ERROR",
            message: "Entry not found",
        });
    }

    res.send(result.rows[0]);
});

router.patch("/:id", async function (req, res) {
    const entryId = req.params.id;
    console.log(entryId);
    const { title, value, type } = req.body;

    const errors = [];
    if (title && title.length < 5) {
        errors.push("Title is too short");
    }
    if (value && value < 0) {
        errors.push("Value must be positive");
    }
    if (type && !["income", "expense"].includes(type)) {
        errors.push("Invalid type - please use expense or income");
    }

    if (errors.length > 0) {
        return res.status(400).send({
            errorType: "VALIDATION_ERROR",
            errors,
        });
    }

    const result = await db.query(
        `UPDATE entries SET title = COALESCE($1, title), value = COALESCE($2, value), type = COALESCE($3, type) WHERE id = $4 RETURNING *;`,
        [title, value, type, entryId]
    );
    

    if (result.rows.length === 0) {
        return res.status(404).send({
            errorType: "NOT_FOUND_ERROR",
            message: "Entry not found",
        });
    }

    res.send(result.rows[0]);
});

router.delete("/:id",async function(req,res){
    const entryId= req.params.id;
    const result = await db.query(`DELETE FROM entries WHERE id=$1;`,[entryId]);
    res.send(result.rows[0]);
});

module.exports = router;
