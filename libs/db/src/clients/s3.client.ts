import { S3 } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
config();

export const s3Client = new S3({
  forcePathStyle: false,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS as string,
    secretAccessKey: process.env.S3_SECRET as string,
  },
});
