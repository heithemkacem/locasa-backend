import config from "../../config/config";
import jwt from "jsonwebtoken";
import { IClient, IProfile } from "../../database";
const jwtSecret = config.JWT_SECRET as string;
export const createSendToken = async (user: IProfile, client: IClient) => {
  const { _id, email, type, name } = user;
  const payload = {
    id: _id,
    email,
    type,
    name,
    client_id: client._id,
  };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "30d" });
  return token;
};
