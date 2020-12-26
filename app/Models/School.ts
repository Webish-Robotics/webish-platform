import { DateTime } from 'luxon'
import {BaseModel, beforeSave, column} from '@ioc:Adonis/Lucid/Orm'

export default class School extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public details: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async stringifyDetails(school: School) {
    if (school.$dirty.details) {
      school.details = await JSON.stringify(school.details)
    }
  }
}
