import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'
import Env from '@ioc:Adonis/Core/Env'

export default class UserSeederSeeder extends BaseSeeder {
  public async run () {
    await UserFactory.merge({
      name: 'Administration Team',
      username: 'superuser',
      password: Env.get('ROOT_PASSWORD')
    }).create()
  }
}
