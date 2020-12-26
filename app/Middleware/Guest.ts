/**
 * ===========================================================
 * WEBISH - an extreme fast WEB APP to serve EV3 some sparkles
 *
 * @author Vrinceanu Radu-Tudor, student @ National College "Vasile Alecsandri", Galati, RO
 * @package app/Middleware
 *
 * THIS SOFTWARE IS AS IT IS ANY MODIFICATION WITHOUT THE CONSENT OF THE AUTHOR WILL BE
 * DISPUTED IN TERMS OF THE PROJECT'S LICENSE.
 */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GuestException from 'App/Exceptions/GuestException'

export default class Guest {
  /**
   * This variable is a protected to redirect when the middleware throws an exception.
   * @protected
   */
  protected redirectTo = '/'

  /**
   * This handles the verification of the middleware
   * @param auth
   * @protected
   */
  protected async guest (auth: HttpContextContract['auth']) {
    if (!(await auth.check()))
      return true

    throw new GuestException(
      'You are already logged in into your account, for that you need to logout.',
      401,
      'E_AUTH_NO_GUEST',
      this.redirectTo
    )
  }

  /**
   * This handle function verifies if the middleware can accept the request or not.
   * @param auth
   * @param next
   */
  public async handle ({auth}: HttpContextContract, next: () => Promise<void>) {
    await this.guest(auth)
    await next()
  }
}
