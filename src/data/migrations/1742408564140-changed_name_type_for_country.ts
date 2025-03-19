import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedNameTypeForCountry1742408564140 implements MigrationInterface {
    name = 'ChangedNameTypeForCountry1742408564140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countries" DROP CONSTRAINT "UQ_fa1376321185575cf2226b1491d"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."countries_name_enum" AS ENUM('INDIA', 'AMERICA', 'GLOBAL')`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "name" "public"."countries_name_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "countries" ADD CONSTRAINT "UQ_fa1376321185575cf2226b1491d" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countries" DROP CONSTRAINT "UQ_fa1376321185575cf2226b1491d"`);
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."countries_name_enum"`);
        await queryRunner.query(`ALTER TABLE "countries" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "countries" ADD CONSTRAINT "UQ_fa1376321185575cf2226b1491d" UNIQUE ("name")`);
    }

}
