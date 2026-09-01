import { v2 as cloudinary } from "cloudinary";

export const cloud = () => {
  cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });

  return cloudinary;
};

export const uploadProfileImage = async ({
  file = {},
  path = "general",
} = {}) => {
  return await cloud().uploader.upload(file.path, {
    folder: `${process.env.APPLICATION_NAME}/${path}`,
  });
};

export const uploadFiles = async ({ files = [], path = "general" } = {}) => {
  const attatchment = [];

  for (const file of files) {
    const { secure_url, public_id } = await uploadProfileImage({ file, path });
    attatchment.push({ secure_url, public_id });
  }

  return attatchment;
};

export const destroyImageProfile = async ({ public_id = "" } = {}) => {
  return await cloud().uploader.destroy(public_id);
};

export const destroyFiles = async ({
  public_ids = [],
  options = {
    type: "upload",
    resource_type: "image",
  },
} = {}) => {
  return await cloud().api.delete_resources(public_ids, options);
};

export const deleteFolder = async ({ prefix = "" } = {}) => {
  return await cloud().api.delete_resources_by_prefix(
    `${process.env.APPLICATION_NAME}/${prefix}`,
  );
};
