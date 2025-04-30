import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateLikeTable1713427200002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'likes',
        columns: [
          {
            name: 'user_id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'post_id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['post_id'],
            referencedTableName: 'posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'likes',
      new TableIndex({ name: 'idx_post_id', columnNames: ['post_id'] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('likes', 'idx_post_id');
    await queryRunner.dropTable('likes');
  }
}
