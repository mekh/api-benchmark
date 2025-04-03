import 'dotenv/config';
import 'tsconfig-paths/register';
import express from 'express';
import fastify from 'fastify';
import { graphql, GraphQLSchema } from 'graphql';

import { UserRepository } from '../repositories/user.repository';
import { createSchema } from './gql-schema';

const execGql = async (schema: GraphQLSchema, query: string) => {
  const data = await graphql({
    schema,
    source: query,
  });

  if (data?.errors) {
    console.error(data.errors);
  }

  return data;
};

export const createExpressServer = async () => {
  const repo = await UserRepository.create();
  const schema = createSchema(repo);
  const app = express();
  app.use(express.json());

  app.post('/graphql', async (req, res) => {
    const data = await execGql(schema, (req.body as { query: string }).query);

    res.json(data);
  });

  app.get('/ormJoin', async (_, res) => {
    const data = await repo.ormJoin();

    res.json(data);
  });

  app.get('/rawJoin', async (_, res) => {
    const data = await repo.rawJoin();

    res.json(data);
  });

  return app;
};

export const createFastifyServer = async () => {
  const repo = await UserRepository.create();
  const schema = createSchema(repo);
  const app = fastify();

  app.post('/graphql', async (req) => {
    return execGql(schema, (req.body as { query: string }).query);
  });

  app.get('/ormJoin', repo.ormJoin.bind(repo));
  app.get('/rawJoin', repo.rawJoin.bind(repo));

  return {
    listen: async (port: number, cb?: () => any) => {
      await app.listen({ port });
      if (cb) {
        cb();
      }
    },
  };
};
