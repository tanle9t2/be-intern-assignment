import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateHashtagTable1713427200004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'hashtags',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tagName',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'hashtags',
      new TableIndex({ name: 'idx_tag_name', columnNames: ['tagName'], isUnique: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('hashtags', 'idx_tag_name');
    await queryRunner.dropTable('hashtags');
  }
}
