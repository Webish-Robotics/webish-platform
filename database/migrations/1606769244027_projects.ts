import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('team_id').unsigned().notNullable()
      table.json('details').notNullable()
      table.timestamps(true)

      table.foreign('team_id').references('id').inTable('teams')
      table.foreign('user_id').references('id').inTable('users')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
