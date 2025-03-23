import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedCvvTypeInPaymentMethods1742546195520
  implements MigrationInterface
{
  name = 'ChangedCvvTypeInPaymentMethods1742546195520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "cvv"`);
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD "cvv" character varying(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "cvv"`);
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD "cvv" smallint NOT NULL`,
    );
  }
}
