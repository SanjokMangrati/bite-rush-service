import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolePermissions1742549392271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "permissions" ("name")
      VALUES 
        ('VIEW_RESTAURANTS'),
        ('CREATE_ORDER'),
        ('PLACE_ORDER'),
        ('CANCEL_ORDER'),
        ('UPDATE_PAYMENT')
      ON CONFLICT ("name") DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r, permissions p
      WHERE r.name = 'ADMIN'
        AND p.name IN ('VIEW_RESTAURANTS', 'CREATE_ORDER', 'PLACE_ORDER', 'CANCEL_ORDER', 'UPDATE_PAYMENT')
      ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r, permissions p
      WHERE r.name = 'MANAGER'
        AND p.name IN ('VIEW_RESTAURANTS', 'CREATE_ORDER', 'PLACE_ORDER', 'CANCEL_ORDER')
      ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r, permissions p
      WHERE r.name = 'MEMBER'
        AND p.name IN ('VIEW_RESTAURANTS', 'CREATE_ORDER', 'PLACE_ORDER')
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM role_permissions
      WHERE permission_id IN (
        SELECT id FROM permissions
        WHERE name IN ('VIEW_RESTAURANTS', 'CREATE_ORDER', 'PLACE_ORDER', 'CANCEL_ORDER', 'UPDATE_PAYMENT')
      )
    `);

    await queryRunner.query(`
      DELETE FROM permissions
      WHERE name IN ('VIEW_RESTAURANTS', 'CREATE_ORDER', 'PLACE_ORDER', 'CANCEL_ORDER', 'UPDATE_PAYMENT')
    `);
  }
}
