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
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ProjectValidator from 'App/Validators/ProjectValidator'
import Project from 'App/Models/Project'
import User from 'App/Models/User'

export default class DashboardController {
  protected trainerConst: number = 2

  /**
   * Show the dashboard method
   * @param view
   * @param auth
   */
  public async index({ view, auth }: HttpContextContract) {
    await auth.user?.preload('projects')
    await auth.user?.preload('teams')

    return view.render('dashboard/index')
  }

  /**
   * Store the current project inside the database
   * @param request
   * @param response
   * @param session
   * @param auth
   */
  public async store({ request, response, session, auth }: HttpContextContract) {
    const data = await request.validate(ProjectValidator)
    try {
      await Project.create({
        name: data.name,
        userId: auth.user?.id,
        teamId: data.team,
        details: {
          code: '',
        }
      })
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    return response.redirect().back()
  }

  /**
   * Update the project with the REACT API
   * @param request
   * @param response
   * @param params
   */
  public async update({ request, response, params }: HttpContextContract) {
    const data = request.only(['code'])
    const project = await Project.findOrFail(params.id)
    try {
      project.details = {code: data.code}
      await project.save()
    } catch (error) {
      return response.json(error.message)
    }

    return response.status(200)
  }

  /**
   * Delete a project from the project list.
   * @param params
   * @param session
   * @param response
   */
  public async destroy({ params, session, response }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    try {
      await project.delete()
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    session.flash('success', 'You have deleted with success the project.')
    return response.redirect().back()
  }

  /**
   * Show data about a project
   * @param params
   * @param view
   */
  public async show({ auth, params, view }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)

    const team = await User.query().preload('teams', (query) => {
      query.where('teams.id', project.teamId)
    }).where('id', auth.user?.id) // is secure due to middleware

    return view.render('dashboard/show', {project, team})
  }
}
