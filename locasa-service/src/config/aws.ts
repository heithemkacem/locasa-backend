import config from "./config";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
if (
  !config.AWS_ACCESS_KEY_ID ||
  !config.AWS_SECRET_ACCESS_KEY ||
  !config.AWS_REGION
) {
  throw new Error(
    "Missing required AWS configuration in environment variables"
  );
}
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 6 }, // 10MB file size limit
});
const s3Client = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

export { s3Client, upload };
