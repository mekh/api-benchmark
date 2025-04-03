import { GraphQLSchema } from 'graphql';
import { graphql } from 'graphql/index';
import { UserRepository } from '../../repositories/user.repository';
import { createSchema } from '../gql/schema';

export abstract class BaseHttpServer {
  protected repo!: UserRepository;

  protected schema!: GraphQLSchema;

  abstract listen(port: number, cb?: () => any): Promise<void>;

  public async init() {
    this.repo = await UserRepository.create();
    this.schema = createSchema(this.repo);
  }

  protected async rawJoin() {
    return this.repo.rawJoin();
  }

  protected async ormJoin() {
    return this.repo.ormJoin();
  }

  protected async executeGql(query: string) {
    const data = await graphql({
      schema: this.schema,
      source: query,
    });

    if (data?.errors) {
      console.error(data.errors);
    }

    return data;
  }
}
