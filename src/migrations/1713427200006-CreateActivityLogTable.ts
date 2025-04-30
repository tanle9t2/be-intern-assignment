import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateActivityLogTable1713427200006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activity_log',
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
            name: 'activityType',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'targetId',
            type: 'integer',
            isNullable: true,
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
        checks: [
          {
            name: 'chk_activityType',
            expression: `activityType IN ('POST', 'LIKE', 'FOLLOW', 'UNFOLLOW')`,
          },
        ],
      }),
      true
    );

    // Create indexes
    await queryRunner.createIndices('activity_log', [
      new TableIndex({
        name: 'idx_user_activity',
        columnNames: ['user_id', 'activityType', 'createdAt'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndices('activity_log', [
      new TableIndex({
        name: 'idx_user_activity',
        columnNames: ['user_id', 'activityType', 'createdAt'],
      }),
    ]);
    await queryRunner.dropTable('activity_log');
  }
}
