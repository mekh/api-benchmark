type Proto = 'gql' | 'http';
type Driver<T extends Proto> = T extends 'gql'
  ? 'mercurius' | 'apollo' | 'raw'
  : 'express' | 'fastify';

interface TestResult<T extends Proto> {
  proto: T;
  datasource: 'typeorm';
  type: 'ormJoin' | 'rawJoin';
  driver: Driver<T>;
  count: number;
  rps: number;
}

interface Results {
  vus: number;
  duration: string;
  results: (TestResult<'gql'> | TestResult<'http'>)[];
}

const results: Results = {
  vus: 30,
  duration: '1m',
  results: [
    {
      proto: 'gql',
      datasource: 'typeorm',
      type: 'ormJoin',
      driver: 'apollo',
      count: 45103,
      rps: 150.242817,
    },
    {
      proto: 'gql',
      datasource: 'typeorm',
      type: 'ormJoin',
      driver: 'mercurius',
      count: 54934,
      rps: 183.021542,
    },
    {
      proto: 'http',
      datasource: 'typeorm',
      type: 'ormJoin',
      driver: 'express',
      count: 49068,
      rps: 163.467869,
    },
    {
      proto: 'http',
      datasource: 'typeorm',
      type: 'ormJoin',
      driver: 'fastify',
      count: 49815,
      rps: 165.949842,
    },
    /** RAW JOIN */
    {
      proto: 'gql',
      datasource: 'typeorm',
      type: 'rawJoin',
      driver: 'apollo',
      count: 62735,
      rps: 209.02411,
    },
    {
      proto: 'gql',
      datasource: 'typeorm',
      type: 'rawJoin',
      driver: 'mercurius',
      count: 82508,
      rps: 274.939598,
    },
    {
      proto: 'http',
      datasource: 'typeorm',
      type: 'rawJoin',
      driver: 'express',
      count: 70749,
      rps: 235.733714,
    },
    {
      proto: 'http',
      datasource: 'typeorm',
      type: 'rawJoin',
      driver: 'fastify',
      count: 71767,
      rps: 239.127595,
    },
  ],
};
