require("dotenv").config();

module.exports = {
    db: require("./db"),
    jwt: require("./jwt"),
};