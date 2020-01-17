const express = require("express");

const session = require("express-session");

const KnexSession = require("connect-session-knex")(session);

const dbConfig = require("./data/dbConfig");

const server = express();

const PORT = process.env.PORT || 5000;

const usersRoute = require("./Users/usersRoute");
server.use(express.json());
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret:"Peanut Butter Sandwich on Bread",
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false, // only for development
        httpOnly: true
    },
    store: new KnexSession({
        knex: dbConfig,
        createTable: true,
    })
}));



server.use("/api", usersRoute);

server.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: "Something went wrong"});
});

server.listen(PORT, () => {
    console.log(`\n***Server running on port ${PORT}***\n`);
});