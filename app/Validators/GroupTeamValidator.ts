import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GroupTeamValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    username: schema.string({
      escape: true,
      trim: true
    }, [
      rules.required(),
      rules.maxLength(32),
      rules.alpha({allow: ['dash', 'underscore']}),
      rules.exists({table: 'users', column: 'username'})
    ]),
    role: schema.number([
      rules.required(),
      rules.range(1, 2)
    ])
  })

  public messages = {}
}
