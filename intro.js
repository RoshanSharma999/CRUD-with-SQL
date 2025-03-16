const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

//setting up connection with mysql db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: '#codeRoshan'
});

//inserting new user manually
// let q = "INSERT INTO user (id, username, email ,password) VALUES ?";
// let newUser = [["124", "jin", "samurai@gmail.com", "yuna"], ["125", "omen", "scaterrr@gmail.com", "roit"]];

//inserting users in bulk using FAKER
let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password()
    ];
}
let q = "INSERT INTO user VALUES ?";
let data = [];
for(let i=0; i<100; i++){
    data.push(getRandomUser());
}
try {
    connection.query(q, [data], (err, result) => {
        if (err) throw err;
        console.log(result);
    });
} catch (err) {
    console.log(err);
}
connection.end();