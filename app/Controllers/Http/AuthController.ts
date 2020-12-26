/**
 * ===========================================================
 * WEBISH - an extreme fast WEB APP to serve EV3 some sparkles
 *
 * @author Vrinceanu Radu-Tudor, student @ National College "Vasile Alecsandri", Galati, RO
 * @package app/Controllers/Http
 *
 * THIS SOFTWARE IS AS IT IS ANY MODIFICATION WITHOUT THE CONSENT OF THE AUTHOR WILL BE
 * DISPUTED IN TERMS OF THE PROJECT'S LICENSE.
 */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  constructor(protected redirectTo: string = '/dashboard') {
  }

  /**
   * Return the view in order to show the login form.
   * @param view
   */
  public async showLogin({ view }: HttpContextContract) {
    return view.render('login')
  }

  /**
   * Return the login method for this form.
   * @param auth
   * @param response
   * @param request
   * @param session
   */
  public async login({ auth, response, request, session }: HttpContextContract) {
    // Validate the data-format
    const data = await request.validate(AuthValidator)

    // Attempt to auth the user
    await auth.attempt(data.username, data.password, request.only['remeber'] === 'checked')

    // Session flash for the success message
    session.flash('success', 'You have logged into your account with success.')
    return response.redirect().toRoute(this.redirectTo)
  }

  /**
   * This is the logout method for the class.
   * @param auth
   * @param response
   * @param session
   */
  public async logout({ auth, response, session }: HttpContextContract) {
    await auth.logout()

    session.flash('success', 'You have logged out from your account with success.')
    return response.redirect().toRoute('welcome')
  }
}
