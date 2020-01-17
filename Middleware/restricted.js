

const restrictedCookies = () => {
    return async (req, res, next) => {
        try {
            if (!req.session || !req.session.user) {
                return res.status(403).json({message: "You are not authorized"});
            }
            next();
        } catch(err) {
            next(err);
        }
    }
}

module.exports = restrictedCookies;