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

export default class AuthValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    username: schema.string({
      escape: true,
      trim: true
    }, [
      rules.alpha({ allow: ['underscore'] }),
      rules.required(),
      rules.exists({ table: 'users', column: 'username' })
    ]),
    password: schema.string({
      escape: true,
      trim: true
    }, [
      rules.required(),
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Make sure to enter the field value.',
    'username.alpha': 'The username field is allowed to have letters and underscore.',
    'username.exists': 'The username was not found in our database or the account is deactivated.'
  }
}
