const jwt = require("@helpers/jwt");
const createError = require("http-errors");
const User = require("@models/User");
const Permission = require("@models/Permission");

exports.apiAuth = async (req, res, next) => {
  try {
    let token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
    if (!token) throw createError.Unauthorized("Token not provided");
    let auth_payload = await jwt.verifyAccessToken(token);
    req.auth_payload = auth_payload;
    next();
  } catch (err) {
    next(err);
  }
};

exports.checkRefreshTokenAuth = async (req, res, next) => {
  const body = req.body;
  try {
    let auth_payload = await jwt.verifyRefreshToken(body.refresh_token);
    req.auth_payload = auth_payload;
    next();
  } catch (err) {
    next(err);
  }
};

exports.permissionsAuth = (permission) => async (req, res, next) => {
  const id = req.auth_payload.id;
  try {
    const user = await User.findById(id);
    const permissions = await Permission.findOne({ user });
    if (!user) {
      throw createError.NotFound("User doesn't exist");
    }

    const isPermission = permissions.permissions.find(
      (item) =>
        item.subject === permission.subject && item.action === permission.action
    );
    console.log("user.role", user.role);
    if (user.role !== "admin")
      if (isPermission) next();
      else throw createError.Unauthorized("Not authorized");
    else next();
  } catch (err) {
    next(err);
  }
};
