import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} from 'graphql';
import { UserRepository } from '../repositories/user.repository';

const ActionType = new GraphQLObjectType({
  name: 'Action',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const ResourceType = new GraphQLObjectType({
  name: 'Resource',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const PermissionType = new GraphQLObjectType({
  name: 'Permission',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    resource: { type: new GraphQLNonNull(ResourceType) },
    action: {
      type: new GraphQLNonNull(ActionType),
    },
  },
});

const RoleType = new GraphQLObjectType({
  name: 'Role',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    permissions: { type: new GraphQLNonNull(new GraphQLList(PermissionType)) },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    isAdmin: { type: new GraphQLNonNull(GraphQLBoolean) },
    active: { type: new GraphQLNonNull(GraphQLBoolean) },
    roles: { type: new GraphQLNonNull(new GraphQLList(RoleType)) },
  },
});

export const createSchema = (repo: UserRepository): GraphQLSchema => {
  const root = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      rawJoin: {
        type: new GraphQLList(UserType),
        resolve: repo.rawJoin.bind(repo),
      },
      ormJoin: {
        type: new GraphQLList(UserType),
        resolve: repo.ormJoin.bind(repo),
      },
    },
  });

  return new GraphQLSchema({ query: root });
};
