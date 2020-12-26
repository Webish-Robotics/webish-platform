import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Schools extends BaseSchema {
  protected tableName = 'schools'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 256).notNullable().unique()
      table.json('details').nullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
