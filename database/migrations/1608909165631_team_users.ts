import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TeamUsers extends BaseSchema {
  protected tableName = 'team_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.integer('team_id').unsigned().notNullable()
      table.integer('role').unsigned().defaultTo(1)
      table.timestamps(true)

      table.foreign('user_id').references('id').inTable('users')
      table.foreign('team_id').references('id').inTable('teams')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
