import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string({
      escape: true,
    }, [
      rules.required(),
      rules.maxLength(96),
      rules.alpha({allow: ['space', 'dash']}),
      rules.unique({table: 'users', column: 'name', whereNot: {id: [this.ctx.params.id]}})
    ]),
    email: schema.string({
      escape: true,
    }, [
      rules.required(),
      rules.maxLength(96),
      rules.email()
    ]),
    username: schema.string({
      escape: true,
      trim: true
    }, [
      rules.required(),
      rules.maxLength(32),
      rules.alpha({allow: ['dash', 'underscore']}),
      rules.unique({table: 'users', column: 'username', whereNot: {id: [this.ctx.params.id]}})
    ]),
    password: schema.string({
      escape: true,
      trim: true
    }, [
      rules.required(),
      rules.maxLength(32),
    ]),
    email_parent: schema.string.optional({
      escape: true,
      trim: true
    }, [
      rules.maxLength(96),
      rules.alpha({allow: ['space', 'dash']}),
    ]),
    phone: schema.string({
      escape: true,
      trim: true
    }, [
      rules.required(),
      rules.mobile({strict: true, locales: ['ro-RO']})
    ])
  })

  public messages = {
    required: 'The field must be filled up with the details.',
    maxLegnth: 'The field must have the length of {{ options.maxLength }}.',
    email: 'The field must be a valid e-mail.',
    mobile: 'The mobile must be a valid {{ options.mobile.locales[0] }} phone number.',
    alpha: 'The field must have only letters (underscores/dashes).'
  }
}
