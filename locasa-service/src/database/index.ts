import { connectDB } from "./connection";
import Profile, { IProfile } from "./models/profile/profile";
import ExpoPushToken from "./models/push-token/push-token";
import OTP from "./models/otp/otp";
import Client, { IClient } from "./models/client/client";
import Vendor, { IVendor } from "./models/vendor/vendor";
import Image, { IImage } from "./models/images/Images";
export {
  connectDB,
  Profile,
  IProfile,
  ExpoPushToken,
  OTP,
  Client,
  IClient,
  Image,
  IImage,
  Vendor,
  IVendor,
};
