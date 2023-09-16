import * as typescriptAddResolverPlugin from '@graphql-codegen/add';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptOperationPlugin from '@graphql-codegen/typescript-operations';
import * as typescriptResolverPlugin from '@graphql-codegen/typescript-resolvers';
import { mergeTypeDefs } from '@graphql-tools/merge';
import gql from 'graphql-tag';
import * as fs from 'fs';
import {
  buildASTSchema,
  DocumentNode,
  GraphQLSchema,
  parse,
  printSchema,
} from 'graphql';
import * as path from 'path';

const uploadGraphqlContent = `
import { ReadStream } from "fs";
export interface GraphQLFileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(options?:{encoding?: string, highWaterMark?: number}): ReadStream;
}`;

interface IGenerateCodegenParam {
  schemaPath: string;
  outputFile: string;
}

const baseAppPath = 'src';
const baseSchemaPath = 'graphql/schema';
const baseOutputCodegenPath = 'codegen-generated.ts';

export const generateCodegen = async ({
  schemaPath,
  outputFile,
}: IGenerateCodegenParam) => {
  const mainOutputPath = `../../${outputFile}`;
  const mainSchemaPath = path.resolve(__dirname, `../../${schemaPath}.ts`);

  const { typeDefs } = await import(mainSchemaPath);

  const schema: GraphQLSchema = buildASTSchema(
    mergeTypeDefsWithScalarsAndDirectives(typeDefs)
  );

  const config = {
    documents: [],
    filename: mainOutputPath,
    schema: parse(printSchema(schema)),
    plugins: [
      {
        typescript: {
          enumsAsTypes: false,
          skipTypename: true,
          maybeValue: 'T | undefined',
          scalars: {
            Upload: 'Promise<GraphQLFileUpload>',
            DateTime: 'Date',
            SerialId: 'number',
          },
        },
      },
      {
        typescriptResolver: {
          useIndexSignature: true,
          noSchemaStitching: true,
          skipTypename: true,
        },
      },
      {
        add: {
          content: uploadGraphqlContent,
        },
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptResolver: typescriptResolverPlugin,
      add: typescriptAddResolverPlugin,
      'typescript-operations': typescriptOperationPlugin,
    },
  };

  const output = await codegen(config as never);

  await fs.promises.writeFile(path.join(__dirname, mainOutputPath), output);
};

const generateSchemas = async () => {
  const serviceValues = Object.values({
    backend: {
      serviceName: 'backend',
      schemaPath: `apps/backend/${baseAppPath}/${baseSchemaPath}`,
      outputCodegenPath: `apps/backend/${baseAppPath}/${baseOutputCodegenPath}`,
    },
  });

  for (const service of serviceValues) {
    try {
      await generateCodegen({
        outputFile: service.outputCodegenPath,
        schemaPath: service.schemaPath,
      });
      console.log(`Codegen for ${service.serviceName} outputs generated!`);
    } catch (error) {
      console.error(error);
    }
  }
};

export const removeDirectives = (typeDefs: DocumentNode) => {
  return {
    ...typeDefs,
    definitions: typeDefs.definitions.filter(
      (d) => d.kind !== 'DirectiveDefinition'
    ),
  };
};

export const mergeTypeDefsWithScalarsAndDirectives = (
  typeDefs: DocumentNode
): DocumentNode => {
  return mergeTypeDefs([
    typeDefs,
    gql`
      type Query {
        _sdl: String!
      }
    `,
  ]);
};

generateSchemas()
  .then(() => {
    console.log('🚀 generate all services schemas 🚀');

    process.exit(0);
  })
  .catch(() => {
    process.exit(0);
  });
