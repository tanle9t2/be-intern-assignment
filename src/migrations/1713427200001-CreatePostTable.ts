import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePostTable1713427200001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text', // Changed from varchar(280) to text
            isNullable: false,
          },
          {
            name: 'likeCount',
            type: 'integer',
            unsigned: true,
            default: 0,
            isNullable: false,
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
        ],
      }),
      true
    );

    // Create indexes
    await queryRunner.createIndices('posts', [
      new TableIndex({ name: 'idx_user_created', columnNames: ['user_id', 'createdAt'] }),
      new TableIndex({ name: 'idx_created', columnNames: ['createdAt'] }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndices('posts', [
      new TableIndex({ name: 'idx_user_created', columnNames: ['user_id', 'createdAt'] }),
      new TableIndex({ name: 'idx_created', columnNames: ['createdAt'] }),
    ]);
    await queryRunner.dropTable('posts');
  }
}
