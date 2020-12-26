import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    team: schema.number([
      rules.required(),
      rules.exists({table: 'teams', column: 'id'})
    ]),
    name: schema.string({
      escape: true,
      trim: true
    }, [
      rules.alpha({ allow: ['underscore', 'dash', 'space'] }),
      rules.required(),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    'required': 'This field is required to be filled up.',
    'alpha': 'The field must be form of alphabetic letters (dashes/underscores/spaces) are allowed too.'
  }
}
