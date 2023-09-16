import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@cell-mon/db';
import { MultipartFile } from '@fastify/multipart';
import { config } from 'dotenv';
import { FastifyInstance } from 'fastify';
import { PassThrough } from 'stream';

import { File } from './codegen-generated';

config();

export function uploadFileController(server: FastifyInstance) {
  function readFileFromStream(filename: string) {
    const pass = new PassThrough();

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: pass,
    };

    s3Client.send(new PutObjectCommand(params));

    return pass;
  }

  function uploadFile(filename: string, rs: MultipartFile['file']) {
    return new Promise<File>((resolve, reject) => {
      rs.on('error', (error) => {
        reject(error);
      });

      rs.on('end', async () => {
        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: filename,
          }),
          { expiresIn: 15 * 60 }
        );

        resolve({ key: filename, signedUrl });
      });
      rs.pipe(readFileFromStream(filename));
    });
  }

  server.post('/upload/file', async (req, res) => {
    const file = await req.file();

    if (!file) {
      res
        .send({
          message: 'Bad request',
        })
        .status(401);
      return;
    }

    const { filename, file: rs } = file;

    res.send(await uploadFile(filename, rs));
  });

  server.post('/upload/files', async (req, res) => {
    const parts = req.files();
    const result: File[] = [];

    for await (const part of parts) {
      result.push(await uploadFile(part.filename, part.file));
    }

    res.send(result);
  });
}
