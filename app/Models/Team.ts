import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  computed, manyToMany, ManyToMany
} from '@ioc:Adonis/Lucid/Orm'
import School from 'App/Models/School'
import User from 'App/Models/User'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public schoolId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => School)
  public school: BelongsTo<typeof School>

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'team_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['role']
  })
  public users: ManyToMany<typeof User>

  @computed()
  public get role () {
    return this.$extras.pivot_role
  }
}
