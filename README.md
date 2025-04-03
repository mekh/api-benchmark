# Why and What For
The purpose of this benchmark is to measure the performance differences between various
backend service implementations using real data. It aims to compare REST vs. GraphQL, Express vs. Fastify,
Apollo vs. Mercurius, raw SQL queries vs. TypeORM-generated queries, and more.

This benchmark includes:
- a database schema from a real RBAC service
- a script to populate the database with test data
- test code for Grafana k6
- `REST` endpoints and `GraphQL` resolvers for different tests

# Installation
Before starting, you need to install the PostgreSQL database and the Grafana k6 load testing tool.  
You must edit the `.env` file and set the variables for database connection.  
If necessary, run the migration with `npm run migration:run` and generate test data with `npm run populate`.

# Configuration
The `APP_PLATFORM` variable is set in the format `<PLATFORM>-<FRAMEWORK>`

| APP_PLATFORM | NestJS | GraphQL                                                    | HTTP                                                             |
|--------------|--------|------------------------------------------------------------|------------------------------------------------------------------|
| raw-express  |        | [Graphql](https://www.graphql-js.org/docs/)                | [Express](https://expressjs.com/)                                |
| raw-fastify  |        | [Graphql](https://www.graphql-js.org/docs/)                | [Fastify](https://fastify.dev/)                                  |
| raw-uexpress |        | [Graphql](https://www.graphql-js.org/docs/)                | [Ultimate Express](https://github.com/dimdenGD/ultimate-express) |
| nest-express | ✅      | [Apollo](https://www.apollographql.com/docs/apollo-server) | [Express](https://expressjs.com/)                                |
| nets-fastify | ✅      | [Mercurius](https://mercurius.dev/)                        | [Fastify](https://fastify.dev/)                                  |


Regardless of the configuration, the following endpoints are available:
- `GET /rawJoin`
- `GET /ormJoin`
- `POST /graphql`

The first two endpoints do not accept any parameters and return a response immediately.
The third endpoint accepts a GraphQL query according to the schema and returns the execution result.

When using GraphQL, the type of database query is determined by the query name.

```graphql
query {
  ormJoin { # <--- ormJoin | rawJoin
    id
  }
}
```

# Running
## Query Types
There are two types of database queries: `rawJoin` and `ormJoin`.
- `rawJoin`: A raw SQL query is executed, and the result is manually processed in the code.
- `ormJoin`: The ORM automatically generates and executes the query, handling the returned data.

## Running the Test
Testing is performed using Grafana k6:
```sh
k6 run -e TYPE=ormJoin|rawJoin \
       -e PROTO=gql|http \
       [-e HOST=localhost] \
       [-e PORT=3000] \
       [-e SSL=false] \
       ./test/perf.test.ts
```  
The `TYPE` and `PROTO` parameters are required, the others are optional.

# Observations
Try adding the `createdAt` and `updatedAt` fields the UserRepository class.

Then restart the service and run the tests.
Notice how the requests per second (RPS) decrease just because of the additional fields being returned from the database.
