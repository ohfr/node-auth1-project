const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");

const find = () => {
    return db("users").select("id", "username");
};

const findBy = (filter) => {
    return db("users").where(filter);
};

const findById = (id) => {
    return db("users").where({id}).first("id", "username");
};

const add = async (user) => {
    user.password = bcrypt.hashSync(user.password, 12);
    const [id] = await db("users").insert(user);

    return findById(id);
};

const remove = (id) => {
    return db("users").where({id}).del();
};

const update = async (id, changes) => {
    const [newId] = await db("users").where({id}).update(changes);

    return findById(newId)
};

module.exports = {
    find,
    findBy,
    findById,
    add,
    remove,
    update
};