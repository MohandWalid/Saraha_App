export const findOne = async ({
  model,
  filter = {},
  select = "",
  otp = "",
} = {}) => {
  return await model.findOne(filter).select(select);
};

export const findById = async ({
  model,
  id,
  select = "",
  populate = [],
} = {}) => {
  return await model.findById(id).select(select).populate(populate);
};

export const create = async ({
  model,
  data = [{}],
  option = { validateBeforeSave: true },
}) => {
  return await model.create(data, option);
};

export const updateOne = async ({
  model,
  filter = {},
  data = {},
  option = { runValidators: true },
} = {}) => {
  return await model.updateOne(filter, data, option);
};

export const findOneAndUpdate = async ({
  model = {},
  filter = {},
  data = {},
  select = "",
  populate = [],
  options = { runValidators: true, returnDocument: "after" },
} = {}) => {
  return await model
    .findOneAndUpdate(filter, { ...data, $inc: { __v: 1 } }, options)
    .select(select)
    .populate(populate);
};

export const findOneAndDelete = async ({
  model = {},
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  return await model.findOneAndDelete(filter).select(select).populate(populate);
};
