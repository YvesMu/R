const { authJwtMiddleware } = require("../../lib/authentication");
const AuthController = require("./controller");

class AuthRouter {
  static getRouter() {
    const router = require("express").Router();

    router.route("/login").post(AuthController.login);
    router.route("/register").post(AuthController.register);
    router.route("/refresh").post(authJwtMiddleware(), AuthController.refresh);
    router.route("/me").get(authJwtMiddleware(), AuthController.me);

    return router;
  }
}

module.exports = AuthRouter;
