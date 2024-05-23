const createError = require("http-errors");
const Category = require("@models/Category");
const Product = require("@models/Product");
const { checkExistData } = require("@helpers/service_helpers");

exports.pagination = async (params) => {
  const { offset, limit, order, searchText, isCategory, category, type } =
    params;
  const query = {};
  if (typeof searchText === "string" && searchText.trim() !== "") {
    query.$or = [{ name: { $regex: searchText, $options: "i" } }];
  }
  if (typeof category === "string" && category.trim() !== "") {
    query.category = category;
  }
  query.type = type;
  query.isCategory = isCategory;
  const createdAt = order === "ASC" ? 1 : order === "DSC" ? -1 : 1;
  try {
    const totalCount = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .populate("category", "name")
      .limit(limit)
      .skip(offset * limit)
      .sort({ createdAt: createdAt })
      .exec();
    return { categories, totalCount };
  } catch (err) {
    throw err;
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const isExist = await checkExistData(id, "categories");
    if (!isExist) {
      res.status(404).send({
        status: "Category doesn't exist",
        statusCode: 404,
      });
      return;
    }
    const category = await Category.findOne({ _id: id }).populate("category");
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: category,
    });
  } catch (err) {
    throw err;
  }
};

exports.create = async (params) => {
  try {
    const category = new Category();
    category.name = params.name;
    category.isCategory = params.isCategory;
    category.type = params.type;
    category.category = params.category === "" ? null : params.category;
    await category.save();

    return category;
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

exports.update = async (params) => {
  const id = params.id;
  try {
    const isExist = await checkExistData(id, "categories");
    if (!isExist) {
      throw createError.NotFound("Category doesn't exist");
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        ...params,
      },
      { new: true, runValidators: true }
    );

    return category;
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
    const category = await checkExistData(id, "categories");
    if (!category) {
      res.status(404).send({
        status: "Category doesn't exist",
        statusCode: 404,
      });
      return;
    }
    await Category.deleteMany({ category: id });
    await Product.deleteMany({ category: id });
    await Category.findByIdAndDelete(id);
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
