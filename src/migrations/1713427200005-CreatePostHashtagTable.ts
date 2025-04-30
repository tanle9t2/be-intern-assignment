import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePostHashtagTable1713427200005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_hashtags',
        columns: [
          {
            name: 'post_id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'hashtag_id',
            type: 'integer',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['post_id'],
            referencedTableName: 'posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['hashtag_id'],
            referencedTableName: 'hashtags',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'post_hashtags',
      new TableIndex({ name: 'idx_hashtag_id', columnNames: ['hashtag_id'] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('post_hashtags', 'idx_hashtag_id');
    await queryRunner.dropTable('post_hashtags');
  }
}
