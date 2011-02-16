const jwt = require("jsonwebtoken");
const { ROLES } = require("../../config");
const { User } = require("../models");

/**
 * Middleware to authenticate JWT token and check user role
 *
 * @param {string} minRole Minimum role to authenticate - defaults to {@link ROLES.user}
 *
 * @returns {function} Middleware authentication function
 *
 * @see {@link ROLES}
 *
 * @example
 * const express = require("express");
 * const { authJwtMiddleware } = require("./auth");
 * const { ROLES } = require("./config");
 *
 * const app = express();
 *
 * const adminMiddleware = authJwtMiddleware(ROLES.admin);
 *
 * app.get("/user", authJwtMiddleware(), (req, res) => {
 *  res.send("Hello user");
 * }
 *
 * app.get("/admin", adminMiddleware, (req, res) => {
 *  res.send("Hello admin");
 * }
 */
exports.authJwtMiddleware = (minRole = ROLES.user) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.sendStatus(401);
    const authArray = authHeader.split(" ");
    if (authArray.length !== 2 || authArray[0] !== "Bearer") return res.sendStatus(401);
    const token = authArray[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.sendStatus(401);
      const dbUser = await User.findByPk(user.id);
      if (!dbUser) return res.sendStatus(401);
      if (dbUser.email !== user.email || dbUser.role !== user.role) return res.sendStatus(401);
      if (minRole !== ROLES.user && Number(user.role) < Number(minRole)) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
};

/**
 * Generate JWT access token
 *
 * @param {object} user User object to generate token
 *
 * @returns {string} JWT token
 */
exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

/**
 * Generate JWT refresh token
 *
 * @param {object} user User object to generate token
 *
 * @returns {string} JWT token
 */
exports.generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
};
