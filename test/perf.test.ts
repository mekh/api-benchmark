/* eslint-disable prettier/prettier,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
import http from 'k6/http';
import { check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const loadEnv = (name: string, values?: string[]) => {
  const env = __ENV[name];
  if (values && !values.includes(env)) {
    throw new Error(`\nunknown value for the "${name}" env: ${env}\nallowed values are: ${values.join(', ')}`);
  }

  return env;
}

const PROTO = loadEnv('TEST_PROTO', ['gql', 'http']);
const TYPE = loadEnv('JOIN_METHOD', ['ormJoin', 'rawJoin']);
const HOST = __ENV.APP_HOST || '127.0.0.1';
const PORT = __ENV.APP_PORT || '3000';
const SCHEME = __ENV.SSL === 'true' ? 'https' : 'http';

const BASE_URL = `${SCHEME}://${HOST}:${PORT}`;
const GQL_URL = [BASE_URL, 'graphql'].join('/');
const REST_URL = [BASE_URL, TYPE].join('/');

const GQL_QUERY = [
  'query getUsers {',
    `${TYPE} {`,
      'id',
      'name',
      'active',
      'isAdmin',
      'roles {',
        'id',
        'name',
        'permissions {',
          'id',
          'resource { id name }',
          'action { id name }',
        '}',
      '}',
    '}',
  '}',
].join('\n');

export const ErrorCounter = new Counter('errors_count');
new Rate('failed_requests');

export const options = {
  vus: 30,
  // duration: '1m',
  iterations: 10000,
  thresholds: {
    http_req_duration: ['p(95)<500'],
    failed_requests: ['rate<0.1'],
    errors_count: ['count<1'],
  },
};

export const setup = () => {
  const isHttp = PROTO === 'http';
  const url = isHttp ? REST_URL : GQL_URL;

  const message = [
    `PROTO: ${PROTO}`,
    `TYPE: ${TYPE}`,
    `URL: ${url}`,
  ].join('\n');

  console.log(`\n\n${message}`);
}

const sendGql = (query: string) => {
  const headers = {
    'content-type': 'application/json',
  };

  return http.post(GQL_URL, JSON.stringify({ query, variables: undefined }), {
    headers,
  });
};

const sendRest = () => {
  const headers = {
    'content-type': 'application/json',
  };

  return http.get(REST_URL, { headers });
}

const checkGql = (res: any) => {
  const json = res.json();

  const httpOk = res.status === 200;
  const gqlOk = !!json.data && !Array.isArray(json.errors);

  check(res, {
    'http ok': () => httpOk,
    'gql  ok': () => gqlOk,
  });

  ErrorCounter.add(!gqlOk);
}

const checkRest = (res: any) => {
  const httpOk = res.status === 200;

  check(res, {
    'http ok': () => httpOk,
  });

  ErrorCounter.add(!httpOk);
}

export default function () {
  const res = PROTO === 'gql'
    ? sendGql(GQL_QUERY)
    : sendRest();

  return PROTO === 'gql'
    ? checkGql(res)
    : checkRest(res);
}
