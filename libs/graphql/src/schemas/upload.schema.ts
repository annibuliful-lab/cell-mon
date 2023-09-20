import { GraphQLError, GraphQLScalarType } from 'graphql';
import { noop } from 'lodash';

class Upload {
  file: any;
  promise: any;
  resolve: any;
  reject: any;
  constructor() {
    /**
     * Promise that resolves file upload details. This should only be utilized
     * by {@linkcode GraphQLUpload}.
     * @type {Promise<import("./processRequest.mjs").FileUpload>}
     */
    this.promise = new Promise((resolve, reject) => {
      /**
       * Resolves the upload promise with the file upload details. This should
       * only be utilized by {@linkcode processRequest}.
       * @param {import("./processRequest.mjs").FileUpload} file File upload
       *   details.
       */
      this.resolve = (file: any) => {
        /**
         * The file upload details, available when the
         * {@linkcode Upload.promise} resolves. This should only be utilized by
         * {@linkcode processRequest}.
         * @type {import("./processRequest.mjs").FileUpload | undefined}
         */
        this.file = file;

        resolve(file);
      };

      /**
       * Rejects the upload promise with an error. This should only be
       * utilized by {@linkcode processRequest}.
       * @param {Error} error Error instance.
       */
      this.reject = reject;
    });

    // Prevent errors crashing Node.js, see:
    // https://github.com/nodejs/node/issues/20392
    this.promise.catch(noop);
  }
}

export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value) {
    if (value instanceof Upload) return value.promise;
    throw new GraphQLError('Upload value invalid.');
  },
  parseLiteral(node) {
    throw new GraphQLError('Upload literal unsupported.', { nodes: node });
  },
  serialize() {
    throw new GraphQLError('Upload serialization unsupported.');
  },
});
