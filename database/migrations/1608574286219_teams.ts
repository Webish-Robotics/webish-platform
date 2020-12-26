import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Groups extends BaseSchema {
  protected tableName = 'teams'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('school_id').unsigned().notNullable()
      table.timestamps(true)

      table.foreign('school_id').references('id').inTable('schools')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
