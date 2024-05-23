const createError = require("http-errors");
const Product = require("@models/Product");
const { checkExistData } = require("@helpers/service_helpers");

exports.pagination = async (params) => {
  const { offset, limit, searchText, category, price } = params;
  const query = {};
  if (typeof searchText === "string" && searchText.trim() !== "") {
    query.$or = [{ name: { $regex: searchText, $options: "i" } }];
  }
  if (typeof category === "string" && category.trim() !== "all") {
    query.category = category;
  }
  const priceSort = price === "ASC" ? 1 : price === "DSC" ? -1 : 1;
  try {
    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("images", "filename")
      .populate("category", "name")
      .limit(limit)
      .skip((offset - 1) * limit)
      .sort({ price: priceSort })
      .exec();
    return { products, totalCount };
  } catch (err) {
    throw err;
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const isExist = await checkExistData(id, "products");
    if (!isExist) {
      res.status(404).send({
        status: "Product doesn't exist",
        statusCode: 404,
      });
      return;
    }
    const product = await Product.findOne({ _id: id })
      .populate("images", "filename")
      .populate("category", "name");
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: product,
    });
  } catch (err) {
    throw err;
  }
};

exports.create = async (params) => {
  const { name, category, price, description, images } = params;
  try {
    const product = new Product();
    product.name = name;
    product.category = category;
    product.price = price;
    product.description = description;
    product.images = images;
    await product.save();

    return product;
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
    const isExist = await checkExistData(id, "products");
    if (!isExist) {
      throw createError.NotFound("Product doesn't exist");
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...params,
      },
      { new: true, runValidators: true }
    );

    return product;
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
    const product = await checkExistData(id, "products");
    if (!product) {
      res.status(404).send({
        status: "Product doesn't exist",
        statusCode: 404,
      });
      return;
    }
    await Product.findByIdAndDelete(id);
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
