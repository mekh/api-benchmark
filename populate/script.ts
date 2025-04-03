import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { datasource } from '../datasource.config';

import { PermissionEntity } from '../src/entities/permission.entity';
import { ResourceEntity } from '../src/entities/resource.entity';
import { ActionEntity } from '../src/entities/action.entity';
import { RoleEntity } from '../src/entities/role.entity';
import { UserEntity } from '../src/entities/user.entity';
import { ACTIONS, RESOURCES, ROLES } from './data';

const BATCH_SIZE = 2000;
const USERS_TO_GENERATE = 1_200_000;
const pass = '123';
let adminId = -1;

const toTime = (timestamp: number): string => {
  const dif = Date.now() - timestamp;
  const inSec = Math.ceil(dif / 1000);

  return `${inSec}s`;
};

const rand = <T>(arr: T[], min = 1, max = arr.length): T[] => {
  const src = [...arr];
  const res: T[] = [];

  const size = Math.floor(Math.random() * (max - min + 1)) + min;

  for (let i = 0; i < size; i += 1) {
    const idx = Math.floor(Math.random() * src.length);
    res.push(src[idx]);
    src.splice(idx, 1);
  }

  return res;
};

const getUser = (base: number, roles: RoleEntity[]): UserEntity => {
  const user = new UserEntity();

  user.name = `${base}`.padStart(8, '0');
  user.email = `${user.name}@generated.local`;
  user.guid = uuid();
  user.password = pass;
  user.active = true;
  user.isAdmin = false;
  user.roles = rand(roles, 1, 10);

  return user;
};

const createAdmin = async (
  manager: EntityManager,
  roles: RoleEntity[],
): Promise<UserEntity> => {
  const admin = getUser(1, roles);

  admin.name = 'admin';
  admin.email = '1';
  admin.password = '123';
  admin.isAdmin = true;

  await manager.save(admin);

  return admin;
};

let base = 1;
const getUsersBatch = (batchSize: number, roles: RoleEntity[]) => {
  const batch = [];
  for (let i = 0; i < batchSize; i += 1) {
    batch.push(getUser(++base, roles));
  }

  return batch;
};

const createUsers = async (
  manager: EntityManager,
  roles: RoleEntity[],
  batchSize: number,
) => {
  const data = getUsersBatch(batchSize, roles);
  console.log('\tgot the batch data');

  await manager.save(UserEntity, data);
  console.log('\tinserted to the database');
};

const createRoles = async (
  manager: EntityManager,
  perms: PermissionEntity[],
) => {
  const roles: RoleEntity[] = ROLES.map((name) => {
    const role = new RoleEntity();

    role.name = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    role.active = true;
    role.users = [];
    role.permissions = rand(perms, 10, Math.min(perms.length, 100));

    return role;
  });

  return manager.save(RoleEntity, roles);
};

const createResources = async (
  manager: EntityManager,
): Promise<ResourceEntity[]> => {
  const resources = [...new Set(RESOURCES)].map((name) => {
    const resource = new ResourceEntity();

    resource.name = name;

    return resource;
  });

  return manager.save(resources);
};

const createActions = async (
  manager: EntityManager,
): Promise<ActionEntity[]> => {
  const actions = ACTIONS.map((name) => {
    const action = new ActionEntity();

    action.name = name;

    return action;
  });

  return manager.save(actions);
};

const createPermissions = async (
  manager: EntityManager,
  resources: ResourceEntity[],
  action: ActionEntity[],
): Promise<PermissionEntity[]> => {
  const permissions = resources.flatMap(({ id: resourceId }) =>
    action.map(({ id: actionId }) => {
      const permission = new PermissionEntity();

      permission.resourceId = resourceId;
      permission.actionId = actionId;

      return permission;
    }),
  );

  return manager.save(permissions);
};

const run = async () => {
  const connection = await datasource.initialize();
  const manager = connection.createEntityManager();

  const resources = await createResources(manager);
  const actions = await createActions(manager);
  const perms = await createPermissions(manager, resources, actions);
  const roles = await createRoles(manager, perms);

  const admin = await createAdmin(manager, roles);
  adminId = admin.id;

  if (!adminId) {
    throw new Error('failed to create an admin');
  }

  const batches = Math.ceil(USERS_TO_GENERATE / BATCH_SIZE);
  const startGlobal = Date.now();

  for (let i = 0; i < batches; i += 1) {
    console.log(`batch #${i + 1} out of ${batches}`);

    const startBatch = Date.now();
    await createUsers(manager, roles, BATCH_SIZE);

    console.log(`batch ${i + 1} done in ${toTime(startBatch)}`);
  }

  console.log(`finished in ${toTime(startGlobal)}`);
  await connection.destroy();
};

void run().then(() => console.log('DONE'));
