import Profile, { IProfile } from "./models/profile/profile";
import Client, { IClient } from "./models/client/client";
import Vendor, { IVendor } from "./models/vendor/vendor";
import OTP, { IOTP } from "./models/otp/otp";
import { connectDB } from "./connection";

export {
  Profile,
  IProfile,
  Client,
  IClient,
  Vendor,
  IVendor,
  OTP,
  IOTP,
  connectDB,
};
