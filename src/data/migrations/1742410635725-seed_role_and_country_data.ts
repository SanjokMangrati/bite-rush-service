import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoleAndCountryData1742410635725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO roles (id, name)
            VALUES 
              (gen_random_uuid(), 'ADMIN'),
              (gen_random_uuid(), 'MANAGER'),
              (gen_random_uuid(), 'MEMBER')
        `);

    await queryRunner.query(`
            INSERT INTO countries (id, name)
            VALUES 
              (gen_random_uuid(), 'GLOBAL'),
              (gen_random_uuid(), 'INDIA'),
              (gen_random_uuid(), 'AMERICA')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM roles WHERE name IN ('ADMIN', 'MANAGER', 'MEMBER')`,
    );
    await queryRunner.query(
      `DELETE FROM countries WHERE name IN ('GLOBAL', 'INDIA', 'AMERICA')`,
    );
  }
}
