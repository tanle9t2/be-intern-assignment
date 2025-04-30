import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFollowTable1713427200003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'follows',
        columns: [
          {
            name: 'follower_id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'followed_id',
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
            columnNames: ['follower_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['followed_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'follows',
      new TableIndex({ name: 'idx_followed_id', columnNames: ['followed_id'] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('follows', 'idx_followed_id');
    await queryRunner.dropTable('follows');
  }
}
