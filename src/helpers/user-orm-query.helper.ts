// import { FindManyOptions, In } from 'typeorm';
// import { UserEntity } from '../entities/user.entity';
//
// export const ormUserQuery: FindManyOptions<UserEntity> = {
//   relations: {
//     roles: {
//       permissions: {
//         resource: true,
//         action: true,
//       },
//     },
//   },
//   select: {
//     id: true,
//     guid: true,
//     name: true,
//     email: true,
//     isAdmin: true,
//     active: true,
//     // createdAt: true,
//     // updatedAt: true,
//     roles: {
//       id: true,
//       active: true,
//       name: true,
//       // createdAt: true,
//       // updatedAt: true,
//       permissions: {
//         id: true,
//         resourceId: true,
//         actionId: true,
//         // createdAt: true,
//         // updatedAt: true,
//         resource: {
//           id: true,
//           name: true,
//           // createdAt: true,
//           // updatedAt: true,
//         },
//         action: {
//           id: true,
//           name: true,
//           // createdAt: true,
//           // updatedAt: true,
//         },
//       },
//     },
//   },
//   where: { id: In([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) },
// };
