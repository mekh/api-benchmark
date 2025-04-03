import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, In } from 'typeorm';

import { DbConfig } from '../config/db.config';
import { QueryConfig } from '../config/query.config';
import { RoleEntity } from '../entities/role.entity';
import { UserEntity } from '../entities/user.entity';

export interface RawData
  extends Pick<
    UserEntity,
    'id' | 'guid' | 'name' | 'email' | 'password' | 'isAdmin' | 'active'
  > {
  roleId: number;
  roleName: string;
  roleActive: boolean;
  roleCreatedAt: Date;
  roleUpdatedAt: Date;
  permId: number;
  permissionCreatedAt: Date;
  permissionUpdatedAt: Date;
  resourceId: number;
  resourceName: string;
  resourceCreatedAt: Date;
  resourceUpdatedAt: Date;
  actionId: number;
  actionName: string;
  actionCreatedAt: Date;
  actionUpdatedAt: Date;
}

@Injectable()
export class UserRepository {
  public static async create(): Promise<UserRepository> {
    const datasource = new DataSource({
      ...new DbConfig(),
      entities: [path.join(__dirname, '../entities/*.entity.{js,ts}')],
    });
    await datasource.initialize();
    const config = new QueryConfig();

    return new UserRepository(datasource, config);
  }

  constructor(
    private readonly datasource: DataSource,
    private readonly opts: QueryConfig,
  ) {}

  public async rawJoin() {
    const data = await this.datasource.query<RawData[]>(this.getRawQuery());

    return this.rawToUser(data);
  }

  public async ormJoin() {
    return this.datasource.manager.find(UserEntity, this.getOrmQuery());
  }

  public getRawQuery(): string {
    const ids = this.opts.randomizeIds().join(', ');

    return `
      SELECT u."id",
             u."guid",
      --       u."password",
             u."name",
             u."email",
             u."isAdmin",
             u."active",
             r."id" as "roleId",
             r."name" as "roleName",
             r."active" as "roleActive",
      --        r."createdAt" as "roleCreatedAt",
      --        r."updatedAt" as "roleUpdatedAt",
             p."id" as "permId",
      --       p."createdAt" as "permissionCreatedAt",
      --       p."updatedAt" as "permissionUpdatedAt",
             rs."id" as "resourceId",
             rs."name" as "resourceName",
      --       rs."createdAt" as "resourceCreatedAt",
      --       rs."updatedAt" as "resourceUpdatedAt",
             a."id" as "actionId",
             a."name" as "actionName"
      --       a."createdAt" as "actionCreatedAt",
      --       a."updatedAt" as "actionUpdatedAt"
      FROM "user" u
        LEFT JOIN "user_role" ur ON ur."userId" = u."id"
        LEFT JOIN "role" r ON r."id" = ur."roleId"
        LEFT JOIN "role_permission" rp ON rp."roleId" = r."id"
        LEFT JOIN "permission" p ON p."id" = rp."permissionId"
        LEFT JOIN "resource" rs ON rs."id" = p."resourceId"
        LEFT JOIN "action" a ON a."id" = p."actionId"
      WHERE u."id" IN (${ids});
  `;
  }

  public getOrmQuery(): FindManyOptions<UserEntity> {
    const ids = this.opts.randomizeIds();

    return {
      relations: {
        roles: {
          permissions: {
            resource: true,
            action: true,
          },
        },
      },
      select: {
        id: true,
        guid: true,
        name: true,
        email: true,
        isAdmin: true,
        active: true,
        // createdAt: true,
        // updatedAt: true,
        roles: {
          id: true,
          active: true,
          name: true,
          // createdAt: true,
          // updatedAt: true,
          permissions: {
            id: true,
            resourceId: true,
            actionId: true,
            // createdAt: true,
            // updatedAt: true,
            resource: {
              id: true,
              name: true,
              // createdAt: true,
              // updatedAt: true,
            },
            action: {
              id: true,
              name: true,
              // createdAt: true,
              // updatedAt: true,
            },
          },
        },
      },
      where: { id: In(ids) },
    };
  }

  public rawToUser(data: RawData[]) {
    const usersMap = new Map<number, UserEntity>();
    for (const item of data) {
      const user = usersMap.get(item.id) ?? {
        id: item.id,
        guid: item.guid,
        password: item.password,
        name: item.name,
        email: item.email,
        isAdmin: item.isAdmin,
        active: item.active,
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      user.roles = user.roles ?? [];

      const { roleId } = item;
      const rolesMap = new Map(user.roles.map((role) => [role.id, role]));
      const hasRole = rolesMap.has(roleId);

      const role: RoleEntity = hasRole
        ? rolesMap.get(roleId)!
        : {
            id: roleId,
            name: item.roleName,
            active: item.roleActive,
            permissions: [],
            createdAt: item.roleCreatedAt,
            updatedAt: item.roleUpdatedAt,
          };

      role.permissions!.push({
        id: item.permId,
        resourceId: item.resourceId,
        actionId: item.actionId,
        createdAt: item.permissionCreatedAt,
        updatedAt: item.permissionUpdatedAt,
        resource: {
          id: item.resourceId,
          name: item.resourceName,
          createdAt: item.resourceCreatedAt,
          updatedAt: item.resourceUpdatedAt,
        },
        action: {
          id: item.actionId,
          name: item.actionName,
          createdAt: item.actionCreatedAt,
          updatedAt: item.actionUpdatedAt,
        },
      });

      if (!hasRole) {
        user.roles.push(role);
      }

      usersMap.set(user.id, user);
    }

    return [...usersMap.values()];
  }
}
