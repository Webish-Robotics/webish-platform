import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column,
  BelongsTo,
  beforeSave
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Team from 'App/Models/Team'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public userId: number

  @column()
  public teamId: number

  @column()
  public details: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @beforeSave()
  public static async stringifyDetails(project: Project) {
    if (project.$dirty.details) {
      project.details = await JSON.stringify(project.details)
    }
  }
}
