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

export default class IndexController {
  /**
   * Show the welcome view in the show method
   * @param view
   */
  public async show({ view }: HttpContextContract) {
    return view.render('welcome')
  }

  public async store() {

  }
}
