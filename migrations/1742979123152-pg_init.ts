import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgInit1742979123152 implements MigrationInterface {
  name = 'PgInit1742979123152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "resource" (
                "id" SERIAL NOT NULL,
                "name" character varying(25) NOT NULL,
                "description" character varying(255),
                "createdBy" integer,
                "updatedBy" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "resource_name_uindex" ON "resource" ("name")
        `);
    await queryRunner.query(`
            CREATE TABLE "action" (
                "id" SERIAL NOT NULL,
                "name" character varying(25) NOT NULL,
                "description" character varying(255),
                "createdBy" integer,
                "updatedBy" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "action_name_uindex" ON "action" ("name")
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "guid" character varying(36) NOT NULL,
                "name" character varying(32) NOT NULL,
                "email" character varying(255) NOT NULL,
                "active" boolean NOT NULL DEFAULT false,
                "isAdmin" boolean NOT NULL DEFAULT false,
                "password" character varying(255) NOT NULL,
                "createdBy" integer,
                "updatedBy" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "user_guid_uindex" ON "user" ("guid")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "user_email_uindex" ON "user" ("email")
        `);
    await queryRunner.query(`
            CREATE TABLE "permission" (
                "id" SERIAL NOT NULL,
                "resourceId" integer NOT NULL,
                "actionId" integer NOT NULL,
                "createdBy" integer,
                "updatedBy" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_427ed7f007923f03d13a99f7ba" ON "permission" ("resourceId", "actionId")
        `);
    await queryRunner.query(`
            CREATE TABLE "role" (
                "id" SERIAL NOT NULL,
                "name" character varying(25) NOT NULL,
                "active" boolean NOT NULL DEFAULT false,
                "createdBy" integer,
                "updatedBy" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "role_name_uindex" ON "role" ("name")
        `);
    await queryRunner.query(`
            CREATE TABLE "user_role" (
                "userId" integer NOT NULL,
                "roleId" integer NOT NULL,
                CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("userId", "roleId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ab40a6f0cd7d3ebfcce082131f" ON "user_role" ("userId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_dba55ed826ef26b5b22bd39409" ON "user_role" ("roleId")
        `);
    await queryRunner.query(`
            CREATE TABLE "role_permission" (
                "roleId" integer NOT NULL,
                "permissionId" integer NOT NULL,
                CONSTRAINT "PK_b42bbacb8402c353df822432544" PRIMARY KEY ("roleId", "permissionId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e3130a39c1e4a740d044e68573" ON "role_permission" ("roleId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_72e80be86cab0e93e67ed1a7a9" ON "role_permission" ("permissionId")
        `);
    await queryRunner.query(`
            ALTER TABLE "resource"
            ADD CONSTRAINT "FK_092dc435e5fd85324af7ec008b5" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "resource"
            ADD CONSTRAINT "FK_0653dcb637316b0483f735111b3" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "action"
            ADD CONSTRAINT "FK_db59ded1fe7644c43f7746b9657" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "action"
            ADD CONSTRAINT "FK_20c3a329f52113bfb7bd09d0e1b" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_82319f64187836b307e6d6ba08d" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_a19025a009be58684a63961aaf3" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "permission"
            ADD CONSTRAINT "FK_52dc809c500d221d64a2d6a2cf2" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "permission"
            ADD CONSTRAINT "FK_49b05cb4393e094c86768b18ab9" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "permission"
            ADD CONSTRAINT "FK_287fe7669c4035bba465728974c" FOREIGN KEY ("resourceId") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "permission"
            ADD CONSTRAINT "FK_54b459f3ffe8a2420c1bb0aea5a" FOREIGN KEY ("actionId") REFERENCES "action"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role"
            ADD CONSTRAINT "FK_17be5172ac2f4c67687a2e7c67d" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role"
            ADD CONSTRAINT "FK_64a1786ac86cd459077a53f411f" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role"
            ADD CONSTRAINT "user_role_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role"
            ADD CONSTRAINT "user_role_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "role_permission_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "role_permission_permission_id_fk" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_permission_id_fk"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_role_id_fk"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role" DROP CONSTRAINT "user_role_role_id_fk"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role" DROP CONSTRAINT "user_role_user_id_fk"
        `);
    await queryRunner.query(`
            ALTER TABLE "role" DROP CONSTRAINT "FK_64a1786ac86cd459077a53f411f"
        `);
    await queryRunner.query(`
            ALTER TABLE "role" DROP CONSTRAINT "FK_17be5172ac2f4c67687a2e7c67d"
        `);
    await queryRunner.query(`
            ALTER TABLE "permission" DROP CONSTRAINT "FK_54b459f3ffe8a2420c1bb0aea5a"
        `);
    await queryRunner.query(`
            ALTER TABLE "permission" DROP CONSTRAINT "FK_287fe7669c4035bba465728974c"
        `);
    await queryRunner.query(`
            ALTER TABLE "permission" DROP CONSTRAINT "FK_49b05cb4393e094c86768b18ab9"
        `);
    await queryRunner.query(`
            ALTER TABLE "permission" DROP CONSTRAINT "FK_52dc809c500d221d64a2d6a2cf2"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_a19025a009be58684a63961aaf3"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_82319f64187836b307e6d6ba08d"
        `);
    await queryRunner.query(`
            ALTER TABLE "action" DROP CONSTRAINT "FK_20c3a329f52113bfb7bd09d0e1b"
        `);
    await queryRunner.query(`
            ALTER TABLE "action" DROP CONSTRAINT "FK_db59ded1fe7644c43f7746b9657"
        `);
    await queryRunner.query(`
            ALTER TABLE "resource" DROP CONSTRAINT "FK_0653dcb637316b0483f735111b3"
        `);
    await queryRunner.query(`
            ALTER TABLE "resource" DROP CONSTRAINT "FK_092dc435e5fd85324af7ec008b5"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_72e80be86cab0e93e67ed1a7a9"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e3130a39c1e4a740d044e68573"
        `);
    await queryRunner.query(`
            DROP TABLE "role_permission"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_dba55ed826ef26b5b22bd39409"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ab40a6f0cd7d3ebfcce082131f"
        `);
    await queryRunner.query(`
            DROP TABLE "user_role"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."role_name_uindex"
        `);
    await queryRunner.query(`
            DROP TABLE "role"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_427ed7f007923f03d13a99f7ba"
        `);
    await queryRunner.query(`
            DROP TABLE "permission"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."user_email_uindex"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."user_guid_uindex"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."action_name_uindex"
        `);
    await queryRunner.query(`
            DROP TABLE "action"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."resource_name_uindex"
        `);
    await queryRunner.query(`
            DROP TABLE "resource"
        `);
  }
}
