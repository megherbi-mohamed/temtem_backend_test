const createError = require("http-errors");
const File = require("@models/File");

exports.upload = async (req, res) => {
  const images = req.files["images"];
  try {
    const uploadPromises = images.map(async (image) => {
      const data = await File.create({
        originalname: image?.originalname,
        filename: image?.filename,
        mimetype: image?.mimetype,
        size: image?.size,
      });
      return data;
    });
    const files = await Promise.all(uploadPromises);
    res.status(201).send({
      status: "success",
      statusCode: 201,
      message: "Files sucessfully uploaded",
      data: files,
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
