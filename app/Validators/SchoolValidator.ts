/**
 * ===========================================================
 * WEBISH - an extreme fast WEB APP to serve EV3 some sparkles
 *
 * @author Vrinceanu Radu-Tudor, student @ National College "Vasile Alecsandri", Galati, RO
 * @package app/Validators
 *
 * THIS SOFTWARE IS AS IT IS ANY MODIFICATION WITHOUT THE CONSENT OF THE AUTHOR WILL BE
 * DISPUTED IN TERMS OF THE PROJECT'S LICENSE.
 */
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SchoolValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string({
      escape: true,
    }, [
      rules.required(),
      rules.maxLength(96),
      rules.alpha({allow: ['space', 'dash']}),
      rules.unique({table: 'schools', column: 'name', whereNot: {id: [this.ctx.params.id]}})
    ]),
    address: schema.string({
      escape: true,
    }, [
      rules.required(),
      rules.maxLength(96)
    ]),
    contact: schema.string({
      escape: true,
    }, [
      rules.required(),
      rules.maxLength(96),
      rules.email()
    ]),

    phone: schema.string({
      escape: true,
    }, [
      rules.required(),
      rules.mobile({strict: true, locales: ['ro-RO']})
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    'required': 'The field must be filled up with the details.',
    'maxLegnth': 'The field must have the length of {{ options.maxLength }}',
    'email': 'The field must be a valid e-mail',
    'mobile': 'The mobile must be a valid {{ options.mobile.locales[0] }} phone number'
  }
}
