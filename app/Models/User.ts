import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany, computed
} from '@ioc:Adonis/Lucid/Orm'
import Project from 'App/Models/Project'
import Team from 'App/Models/Team'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public details: any

  @hasMany(() => Project, {
    onQuery: (query) => query.orderBy('id', 'desc')
  })
  public projects: HasMany<typeof Project>

  @manyToMany(() => Team, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'team_id',
    pivotColumns: ['role']
  })
  public teams: ManyToMany<typeof Team>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeSave()
  public static async stringifyDetails (user: User) {
    if (user.$dirty.details) {
      user.details = await JSON.stringify(user.details)
    }
  }

  @computed()
  public get role () {
    return this.$extras.pivot_role
  }
}
