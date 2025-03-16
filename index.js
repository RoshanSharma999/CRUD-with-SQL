const express = require('express');
const path = require('path');
const mover = require('method-override');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const app = express();
const port = 8080;

//parsing data for POST method
app.use(mover("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//setting up connection with mysql db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: '#codeRoshan'
})

// home root
app.get("/", (req, res) => {
    let q = "SELECT count(*) FROM user";
    connection.query(q, (err, result) => {
        if (err) return res.send("Some error");
        let num = result[0]["count(*)"];
        res.render("home.ejs", { num });
    });
    console.log("Request on home page");
});

// user list
app.get("/users", (req, res) => {
    let q = "SELECT * FROM user;";
    connection.query(q, (err, result) => {
        if (err) return res.send("Some error");
        let data = result;
        res.render("userList.ejs", { data });
    });
    console.log("Request on userList page");
});

// to edit a user
app.get("/users/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user where id = "${id}"`;
    connection.query(q, (err, result) => {
        if (err) return res.send("Some error");
        let user = result[0];
        res.render("editUser.ejs", { user });
    });
    console.log("Request on userEdit page");
});

app.patch("/users/:id", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user where id = "${id}"`;
    connection.query(q, (err, result) => {
        if (err) return res.send("Some error");
        let user = result[0];
        let { username: newUName, email: newEmail, password } = req.body;
        if (password != user.password) {
            console.log("Wrong password");
            return res.redirect(`/users/${user.id}/edit`);
        }
        let newQ = `UPDATE user SET username="${newUName}", email="${newEmail}" WHERE id="${id}"`;
        connection.query(newQ, (err, result) => {
            if (err) return res.send("Some error");
            console.log("Updated user");
            res.redirect("/users");
        });
    });
});

// to add a user
app.get("/users/new", (req, res) => {
    console.log("Request on addUser page");
    res.render("newUser.ejs");
});
app.post("/users", (req, res) => {
    let {id, username, email, password} = req.body;
    let q = `INSERT INTO user VALUES ("${id}", "${username}", "${email}", "${password}");`;
    connection.query(q, (err, result) => {
        if (err) return res.send("Some error");
        console.log(`User added with id = ${id}`);
        res.redirect("/users");
    });   
});

// to delete a user
app.delete("/users/:id", (req, res) => {
    let { id } = req.params;
    let q = `DELETE FROM user WHERE id = "${id}"`;
    connection.query(q, (err, result) => {
        if (err) return res.send("Some error");
        console.log(`User ${id} deleted`);
        res.redirect("/users");
    });
});


app.get("*", (req, res) => {
    res.send("Error 404 | Page not found");
});