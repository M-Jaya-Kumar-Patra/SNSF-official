import jwt from "jsonwebtoken";

const generatedAccessToken = (userId) => {
  const token = jwt.sign(
    { _id: userId },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: "7d" }
  );
  return token;
};

export default generatedAccessToken;
