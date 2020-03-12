const db = require("./users-model");
const bcrypt = require("bcryptjs");

const express = require("express");

const router = express.Router();

const restrictedCookies = require("../Middleware/restricted");

const restricted = () => {
    return async (req, res,next) => {
        try {
            const {username, password} = req.headers;

            if (!username || !password) {
                return res.status(401).json({message: "Invalid Credentials"});
            };

            const user = await db.findBy({username}).first();

            if (!user) {
                return res.status(401).json({message: "Invalid Credentials"});
            };

            const passwordValid = bcrypt.compareSync(password, user.password);

            if (!passwordValid) {
                return res.status(401).json({message: "Invalid Credentials"});
            };

            next();

        }catch(err) {
            next(err);
        };
    };
};


router.get("/users", restrictedCookies(), async (req, res, next) => {
    try {
        res.json(await db.find());
    } catch(err) {
        next(err);
    };
});


router.get("/users/:id", async (req, res, next) => {
    try {
        res.json(await db.findById(req.params.id));
    } catch(err) {
        next(err);
    };
});

router.put("/users/:id", async (req, res, next) => {
    try {
        res.json(await db.update(req.params.id, req.body));
    } catch(err) {
        next(err);
    };
});

router.delete("/users/:id", async (req, res, next) => {
    try {
        res.json(await db.remove(req.params.id));
    } catch(err) {
        next(err);
    };
});


// login Route
router.post("/login", async (req, res, next) => {
    try {
      const {username, password} = req.body;
      const user = await db.findBy({ username }).first();

      const passwordValid = bcrypt.compareSync(password, user.password);

      if (user && passwordValid) {
        req.session.user = user;

        res.status(200).json({message: "Logged In"});
      } else {
          res.status(401).json({message: "Invalid Credentials"});
      };
    } catch(err) {
        next(err);
    };
});


// Register Route
router.post("/register", async (req, res, next) => {
    try {
        res.status(201).json(await db.add(req.body));
    } catch(err) {
        next(err);
    };
});

router.get("/logout", restrictedCookies(), async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err);
        } else {
            res.json({message: "You are logged out"});
        }
    })
})
module.exports = router;