/**
 * ===========================================================
 * WEBISH - an extreme fast WEB APP to serve EV3 some sparkles
 *
 * @author Vrinceanu Radu-Tudor, student @ National College "Vasile Alecsandri", Galati, RO
 * @package app/Exceptions
 *
 * THIS SOFTWARE IS AS IT IS ANY MODIFICATION WITHOUT THE CONSENT OF THE AUTHOR WILL BE
 * DISPUTED IN TERMS OF THE PROJECT'S LICENSE.
 */
import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AttemptException extends Exception {
  /**
   * This is the class constructor
   * @param message
   * @param http
   * @param code
   */
  constructor(message: string, http: number, code: string) {
    super(message, http, code)
  }

  /**
   * Handle the Exception
   * @param error
   * @param ctx
   */
  public async handle(error: this, ctx: HttpContextContract) {
    ctx.session.flashExcept(['_csrf'])
    ctx.session.flash('attempt', {error: error.message})
    ctx.response.redirect().back()
  }
}
