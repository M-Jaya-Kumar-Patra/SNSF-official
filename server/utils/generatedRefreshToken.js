import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generatedRefreshToken = async (userId, Model = UserModel) => {
  const token = jwt.sign(
    { _id: userId, id: userId },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );

  await Model.updateOne(
    { _id: userId },
    { refresh_token: token }
  );

  return token;
};

export default generatedRefreshToken;
