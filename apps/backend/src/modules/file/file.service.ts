import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrimaryRepository, s3Client } from '@cell-mon/db';
import { GraphqlContext, GraphqlError } from '@cell-mon/graphql';
import { logger } from '@cell-mon/utils';
import { config } from 'dotenv';
import { nanoid } from 'nanoid';

import { File, GraphQLFileUpload } from '../../codegen-generated';

config();

export class Fileservice extends PrimaryRepository<never, GraphqlContext> {
  private expiresInFiftteenMinutes = 15 * 60;

  async getSignedUrl(filename: string): Promise<File> {
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: filename,
      }),
      { expiresIn: this.expiresInFiftteenMinutes },
    );

    return { key: filename, signedUrl };
  }

  async upload(file: Promise<GraphQLFileUpload>): Promise<File> {
    try {
      const { filename: _filename, createReadStream } = await file;
      const rs = createReadStream();

      const filename = `${nanoid()}-${_filename.replace(/ /g, '-')}`;
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.S3_BUCKET,
          Key: filename,
          Body: rs,
        },
      });

      await upload.done();

      return this.getSignedUrl(filename);
    } catch (error) {
      logger.error(error, 'Upload file');
      throw new GraphqlError(
        'Internal server error to upload file',
        {
          statusCode: 500,
        },
        500,
      );
    }
  }

  async delete(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      });
      await s3Client.send(command);
    } catch (error) {
      logger.error(error, 'Delete file');

      throw new GraphqlError(
        'Internal server error to delete file',
        {
          statusCode: 500,
        },
        500,
      );
    }
  }
}
