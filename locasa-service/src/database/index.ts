import { connectDB } from "./connection";
import Profile, { IProfile } from "./models/profile/profile";
import ExpoPushToken from "./models/push-token/push-token";
import OTP from "./models/otp/otp";
import Client, { IClient } from "./models/clients/clients";
import Vendor, { IVendor } from "./models/vendor/vendor";
import Image, { IImage } from "./models/images/Image";
import Notification, {
  INotification,
} from "./models/notification/notification";
import Location, { ILocation } from "./models/location/location";
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
  INotification,
  Notification,
  Location,
  ILocation,
};
