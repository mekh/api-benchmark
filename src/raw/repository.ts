// import * as path from 'node:path';
// import { DataSource } from 'typeorm';
//
// import { UserEntity } from '../entities/user.entity';
// import { ormUserQuery } from '../helpers/user-orm-query.helper';
// import {
//   RawData,
//   rawToUser,
//   rawUsersQuery,
// } from '../helpers/user-raw-query.helper';
// import { DbConfig } from '../config/db.config';
//
// export const datasource = new DataSource({
//   ...new DbConfig(),
//   entities: [path.join(__dirname, '../entities/*.entity.{js,ts}')],
// });
//
// export const rawJoin = async () => {
//   const data = await datasource.query<RawData[]>(rawUsersQuery);
//
//   return rawToUser(data);
// };
//
// export const ormJoin = async () => {
//   return datasource.manager.find(UserEntity, ormUserQuery);
// };
