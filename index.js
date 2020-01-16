const express = require("express");

const server = express();

const PORT = process.env.PORT || 5000;

const usersRoute = require("./Users/usersRoute");

server.use(express.json());

server.use("/api", usersRoute);

server.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: "Something went wrong"});
});

server.listen(PORT, () => {
    console.log(`\n***Server running on port ${PORT}***\n`);
});