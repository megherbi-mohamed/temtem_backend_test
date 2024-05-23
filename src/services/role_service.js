const createError = require("http-errors");
const User = require("@models/User");
const Permission = require("@models/Permission");
const { checkExistData } = require("@helpers/service_helpers");

exports.pagination = async (params) => {
  const { offset, limit, order, searchText } = params;
  const query = {};
  if (typeof searchText === "string" && searchText.trim() !== "") {
    query.$or = [{ email: { $regex: searchText, $options: "i" } }];
  }
  query.role = "staff";
  const createdAt = order === "ASC" ? 1 : order === "DSC" ? -1 : 1;
  try {
    const totalCount = await User.countDocuments(query);
    const roles = await User.find(query)
      .limit(limit)
      .skip(offset * limit)
      .sort({ createdAt: createdAt })
      .exec();
    return { roles, totalCount };
  } catch (err) {
    throw err;
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const isExist = await checkExistData(id, "users");
    if (!isExist) {
      res.status(404).send({
        status: "User doesn't exist",
        statusCode: 404,
      });
      return;
    }

    const permissions = await Permission.findOne({ user: id });

    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: permissions,
    });
  } catch (err) {
    throw err;
  }
};

exports.update = async (params) => {
  const { id, permissions } = params;
  try {
    const isExist = await checkExistData(id, "users");
    if (!isExist) {
      throw createError.NotFound("User doesn't exist");
    }

    await Permission.findOneAndUpdate({ user: id }, { permissions });

    return true;
  } catch (err) {
    if (err.name == "ValidationError")
      throw createError.UnprocessableEntity(err.message);
    else if (err.code === 11000)
      throw createError.Conflict(
        `${Object.keys(err.keyValue)} is already used`
      );
    throw err;
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const isExist = await checkExistData(id, "users");
    if (!isExist) {
      res.status(404).send({
        status: "User doesn't exist",
        statusCode: 404,
      });
      return;
    }
    await User.findByIdAndDelete(id);
    await Permission.findOneAndDelete({ user: id });
    res.status(204).send({
      status: "success",
      statusCode: 204,
    });
  } catch (err) {
    if (err.name == "ValidationError")
      throw createError.UnprocessableEntity(err.message);
    else if (err.code === 11000)
      throw createError.Conflict(
        `${Object.keys(err.keyValue)} is already used`
      );
    throw err;
  }
};
