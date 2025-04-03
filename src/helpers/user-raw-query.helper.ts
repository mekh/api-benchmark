// import { RoleEntity } from '../entities/role.entity';
// import { UserEntity } from '../entities/user.entity';
//
// export interface RawData
//   extends Pick<
//     UserEntity,
//     'id' | 'guid' | 'name' | 'email' | 'password' | 'isAdmin' | 'active'
//   > {
//   roleId: number;
//   roleName: string;
//   roleActive: boolean;
//   roleCreatedAt: Date;
//   roleUpdatedAt: Date;
//   permId: number;
//   permissionCreatedAt: Date;
//   permissionUpdatedAt: Date;
//   resourceId: number;
//   resourceName: string;
//   resourceCreatedAt: Date;
//   resourceUpdatedAt: Date;
//   actionId: number;
//   actionName: string;
//   actionCreatedAt: Date;
//   actionUpdatedAt: Date;
// }
//
// export const rawUsersQuery = `
// SELECT u."id",
//        u."guid",
// --       u."password",
//        u."name",
//        u."email",
//        u."isAdmin",
//        u."active",
//        r."id" as "roleId",
//        r."name" as "roleName",
//        r."active" as "roleActive",
// --        r."createdAt" as "roleCreatedAt",
// --        r."updatedAt" as "roleUpdatedAt",
//        p."id" as "permId",
// --       p."createdAt" as "permissionCreatedAt",
// --       p."updatedAt" as "permissionUpdatedAt",
//        rs."id" as "resourceId",
//        rs."name" as "resourceName",
// --       rs."createdAt" as "resourceCreatedAt",
// --       rs."updatedAt" as "resourceUpdatedAt",
//        a."id" as "actionId",
//        a."name" as "actionName"
// --       a."createdAt" as "actionCreatedAt",
// --       a."updatedAt" as "actionUpdatedAt"
// FROM "user" u
//   LEFT JOIN "user_role" ur ON ur."userId" = u."id"
//   LEFT JOIN "role" r ON r."id" = ur."roleId"
//   LEFT JOIN "role_permission" rp ON rp."roleId" = r."id"
//   LEFT JOIN "permission" p ON p."id" = rp."permissionId"
//   LEFT JOIN "resource" rs ON rs."id" = p."resourceId"
//   LEFT JOIN "action" a ON a."id" = p."actionId"
// WHERE u."id" IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
// `;
//
// export const rawToUser = (data: RawData[]) => {
//   const usersMap = new Map<number, UserEntity>();
//   for (const item of data) {
//     const user = usersMap.get(item.id) ?? {
//       id: item.id,
//       guid: item.guid,
//       password: item.password,
//       name: item.name,
//       email: item.email,
//       isAdmin: item.isAdmin,
//       active: item.active,
//       roles: [],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//
//     user.roles = user.roles ?? [];
//
//     const { roleId } = item;
//     const rolesMap = new Map(user.roles.map((role) => [role.id, role]));
//     const hasRole = rolesMap.has(roleId);
//
//     const role: RoleEntity = hasRole
//       ? rolesMap.get(roleId)!
//       : {
//           id: roleId,
//           name: item.roleName,
//           active: item.roleActive,
//           permissions: [],
//           createdAt: item.roleCreatedAt,
//           updatedAt: item.roleUpdatedAt,
//         };
//
//     role.permissions!.push({
//       id: item.permId,
//       resourceId: item.resourceId,
//       actionId: item.actionId,
//       createdAt: item.permissionCreatedAt,
//       updatedAt: item.permissionUpdatedAt,
//       resource: {
//         id: item.resourceId,
//         name: item.resourceName,
//         createdAt: item.resourceCreatedAt,
//         updatedAt: item.resourceUpdatedAt,
//       },
//       action: {
//         id: item.actionId,
//         name: item.actionName,
//         createdAt: item.actionCreatedAt,
//         updatedAt: item.actionUpdatedAt,
//       },
//     });
//
//     if (!hasRole) {
//       user.roles.push(role);
//     }
//
//     usersMap.set(user.id, user);
//   }
//
//   return [...usersMap.values()];
// };
