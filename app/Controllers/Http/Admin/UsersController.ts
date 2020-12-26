/**
 * ===========================================================
 * WEBISH - an extreme fast WEB APP to serve EV3 some sparkles
 *
 * @author Vrinceanu Radu-Tudor, student @ National College "Vasile Alecsandri", Galati, RO
 * @package app/Controllers/Http/Admin
 *
 * THIS SOFTWARE IS AS IT IS ANY MODIFICATION WITHOUT THE CONSENT OF THE AUTHOR WILL BE
 * DISPUTED IN TERMS OF THE PROJECT'S LICENSE.
 */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  protected limit: number = Env.get('ITEMS_PER_PAGE', 10)

  public async index ({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)

    const users = await User.query().paginate(page, this.limit)
    return view.render('dashboard/users/index', { users })
  }

  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(UserValidator)

    try {
      await User.create({
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        details: {
          email_parent: data.email_parent,
          phone: data.phone
        }
      })
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    session.flash('success', 'The user was created with success.')
    return response.redirect().back()
  }

  public async show ({ view, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    const users_groups = await User.query().preload('teams', (query) => {
      query.orderBy('role', 'desc')
    }).where('id', user.id)

    return view.render('dashboard/users/show', {user, users_groups})
  }

  public async update ({ params, request, response, session }: HttpContextContract) {
    const data = await request.validate(UserValidator)

    try {
      await User.query().where('id', params.id).update({
        name: data.name,
        email: data.email,
        username: data.username,
        details: JSON.stringify({
          email_parent: data.email_parent,
          phone: data.phone
        })
      })
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    session.flash('message', 'The user was updated with success.')
    return response.redirect().back()
  }

  public async destroy ({ response, session, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    try {
      await user.delete()
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    session.flash('message', 'The user was deleted with success.')
    return response.redirect().back()
  }
}
