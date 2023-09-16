import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrimaryRepository, s3Client } from '@tadchud-erp/db';
import { IGraphqlContext } from '@tadchud-erp/graphql';
import { PassThrough } from 'stream';

import { File, GraphQLFileUpload } from '../../codegen-generated';

export class Fileservice extends PrimaryRepository<never, IGraphqlContext> {
  private readFileFromStream(filename: string) {
    const pass = new PassThrough();

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: pass,
    };

    s3Client.send(new PutObjectCommand(params));

    return pass;
  }

  async upload(file: Promise<GraphQLFileUpload>) {
    const { filename, createReadStream } = await file;
    return new Promise<File>((resolve, reject) => {
      const rs = createReadStream();

      rs.on('error', (error) => {
        reject(error);
      });

      return rs.pipe(this.readFileFromStream(filename)).end(() => {
        getSignedUrl(
          s3Client ,
          new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: filename,
          }) ,
          { expiresIn: 15 * 60 }
        ).then((signedUrl) => {
          resolve({ key: filename, signedUrl });
        });
      });
    });
  }
}
