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
import School from 'App/Models/School'
import Team from 'App/Models/Team'
import SchoolValidator from 'App/Validators/SchoolValidator'
import slug from 'slug'

export default class SchoolsController {
  protected limit: number = Env.get('ITEMS_PER_PAGE', 10)

  public async index ({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)

    const schools = await School.query().paginate(page, this.limit)
    return view.render('dashboard/schools/index', { schools })
  }

  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(SchoolValidator)

    try {
      await School.create({
        name: data.name,
        slug: slug(data.name),
        details: {
          address: data.address,
          contact: data.contact,
          phone: data.phone
        }
      })
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    session.flash('success', 'The school was created with success.')
    return response.redirect().back()
  }

  public async show ({ view, params, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const school = await School.findOrFail(params.id)
    const groups = await Team.query().paginate(page, this.limit)

    return view.render('dashboard/schools/show', {school, groups})
  }

  public async update ({ params, request, response, session }: HttpContextContract) {
    const data = await request.validate(SchoolValidator)

    try {
      await School.query().where('id', params.id).update({
        slug: slug(data.name),
        name: data.name,
        details: JSON.stringify({ address: data.address, contact: data.contact, phone: data.phone })
      })
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    session.flash('message', 'The school was updated with success.')
    return response.redirect().back()
  }

  public async destroy ({ response, session, params }: HttpContextContract) {
    const school = await School.findOrFail(params.id)

    try {
      await school.delete()
    } catch (error) {
      session.flash('errormsg', error.message)
      return response.redirect().back()
    }

    session.flash('message', 'The school was deleted with success.')
    return response.redirect().back()
  }
}
