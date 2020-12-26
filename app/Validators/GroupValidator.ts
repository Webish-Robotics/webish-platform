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

export default class GroupValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    group_name: schema.string({
      escape: true,
    }, [
      rules.required(),
      rules.maxLength(96),
      rules.unique({table: 'teams', column: 'name', whereNot: {id: [this.ctx.params.id]}})
    ]),
  })

  public messages = {
    maxLegnth: 'The field must have the length of {{ options.maxLength }}.',
    required: 'The field must be required.',
    unique: 'This entry is already in the database.'
  }
}
