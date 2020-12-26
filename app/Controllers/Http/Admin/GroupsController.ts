import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GroupTeamValidator from 'App/Validators/GroupTeamValidator'
import GroupValidator from 'App/Validators/GroupValidator'
import Team from 'App/Models/Team'
import School from 'App/Models/School'
import User from 'App/Models/User'

export default class GroupsController {
  public async store({ params, request, session, response }: HttpContextContract) {
    const data = await request.validate(GroupValidator)
    const school = await School.findOrFail(params.schoolId)

    try {
      await Team.create({
        name: data.group_name,
        schoolId: school.id
      })
    } catch (error) {
      session.flash('error_group', error.message)
      return response.redirect().back()
    }

    session.flash('success_group', 'The group was created with success.')
    return response.redirect().back()
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)

    try {
      await team.delete()
    } catch (error) {
      session.flash('error_group', error.message)
      return response.redirect().back()
    }

    session.flash('success_group', 'The group was deleted with success.')
    return response.redirect().back()
  }

  public async show({ params, view }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)

    const groups_users = await Team.query().preload('users', (query) => {
      query.orderBy('role', 'desc')
    }).where('id', team.id)

    return view.render('dashboard/groups', {team, groups_users})
  }

  public async update({ params, session, response, request }: HttpContextContract) {
    const team = await Team.findOrFail(params.id)
    const data = await request.validate(GroupValidator)

    try {
      await Team.query().where('id', team.id).update({
        name: data.group_name
      })
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }

    session.flash('success', 'This group was updated with success.')
    return response.redirect().back()
  }

  public async addGroup({ params, session, response, request }: HttpContextContract) {
    const data = await request.validate(GroupTeamValidator)
    const team = await Team.findOrFail(params.id)
    const user = await User.findByOrFail('username', data.username)

    try {
      await user.related('teams').attach({
        [team.id]: {
          role: data.role
        }
      })
    } catch (error) {
      session.flash('error_add', error.message)
      return response.redirect().back()
    }

    session.flash('success_add', `The user ${data.username} was added with success.`)
    return response.redirect().back()
  }

  public async removeUser({ params, session, response }: HttpContextContract) {
    const user = await User.findOrFail(params.userid)
    const team = await Team.findOrFail(params.id)

    try {
      await user.related('teams').detach([team.id])
    } catch (error) {
      session.flash('error_add', error.message)
      return response.redirect().back()
    }

    session.flash('success_add', `The user ${user.username} was removed with success.`)
    return response.redirect().back()
  }
}
