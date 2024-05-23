const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const jwt = require("@helpers/jwt");
const User = require("@models/User");
const Permission = require("@models/Permission");
const { verifyRefreshToken } = require("@helpers/jwt");

// registration
exports.register = async (params) => {
  const { email, password } = params;
  try {
    // check if user exist
    const exist = await User.findOne({ email: email });
    if (exist) {
      throw createError.Forbidden("Email already exist");
    }

    let user = new User();
    user.email = email;
    user.password = password;
    user.role = "staff";
    await user.save();

    // generate permissions

    const permission = new Permission();
    permission.user = user._id;
    permission.permissions = [{ subject: "products", action: "read" }];
    await permission.save();

    return true;
  } catch (err) {
    throw err;
  }
};

// login
exports.login = async ({ email, password }) => {
  try {
    let user = await User.findOne({ email });
    if (!user) {
      throw createError.Forbidden("Invalide credentails");
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      // keep just one user session
      // let tokens = await generateTokens(user);
      // await User.findByIdAndUpdate(user._id, {
      //   lastRefreshToken: tokens.refresh_token,
      // });
      // return {
      //   refresh_token: storedRefreshToken,
      //   access_token: tokens.access_token,
      // };

      // multiple user session
      if (user.lastRefreshToken && user.lastRefreshToken !== "") {
        let storedRefreshToken = user.lastRefreshToken;
        const payload = await verifyRefreshToken(storedRefreshToken);
        if (payload === "Invalid token" || payload === "Expired token") {
          let tokens = await generateTokens(user);
          await User.findByIdAndUpdate(user._id, {
            lastRefreshToken: tokens.refresh_token,
          });
          return {
            refresh_token: storedRefreshToken,
            access_token: tokens.access_token,
          };
        } else {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          if (payload.exp > currentTimestamp) {
            let tokens = await generateTokens(user);
            return {
              refresh_token: storedRefreshToken,
              access_token: tokens.access_token,
            };
          }
        }
      } else {
        let tokens = await generateTokens(user);
        await User.findByIdAndUpdate(user._id, {
          lastRefreshToken: tokens.refresh_token,
        });
        return {
          refresh_token: tokens.refresh_token,
          access_token: tokens.access_token,
        };
      }
    } else throw createError.Unauthorized("Invalide username or password");
  } catch (err) {
    throw err;
  }
};

// get new refresh token
exports.refreshToken = async ({ refresh_token }) => {
  try {
    let user_id = (await jwt.verifyRefreshToken(refresh_token)).id;
    let user = await User.findById(user_id);
    if (user && user.lastRefreshToken === refresh_token) {
      let tokens = await generateTokens(user);

      // keep jsut one user session
      // await User.findByIdAndUpdate(user._id, {
      //   lastRefreshToken: tokens.refresh_token,
      // });
      return { access_token: tokens.access_token };
    } else throw createError.Unauthorized("Expired token");
  } catch (err) {
    throw err;
  }
};

// generate new refresh and access token using jwt
function generateTokens(user) {
  return jwt.generateTokens({
    id: user._id,
    email: user.email,
    role: user.role,
  });
}
