const mongoose = require("mongoose");

exports.checkExistData = async (id, model) => {
  const Model = mongoose.model(model);
  const validId = mongoose.Types.ObjectId.isValid(id);
  if (validId) {
    const isExist = await Model.findOne({ _id: id });
    if (!isExist) {
      return false;
    }
    return isExist;
  } else {
    return false;
  }
};
