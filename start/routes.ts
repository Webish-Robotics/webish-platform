/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route
  .get('/', 'IndexController.show')
  .as('welcome')

Route
  .group(() => {
    Route
      .get('/login', 'AuthController.showLogin')
      .as('auth.show.login')

    Route
      .post('/login', 'AuthController.login')
      .as('auth.login').middleware('throttle:3,10')
  })
  .middleware('guest')

Route
  .group(() => {
    Route
      .get('/logout', 'AuthController.logout')
      .as('auth.logout')

    Route
      .resource('/dashboard', 'DashboardController')
      .except(['create', 'edit'])

    Route
      .resource('/schools', 'Admin/SchoolsController')
      .except(['create', 'edit'])

    Route
      .resource('/users', 'Admin/UsersController')
      .except(['create', 'edit'])

    Route
      .post('/groups/:schoolId', 'Admin/GroupsController.store')
      .as('groups.store')

    Route
      .delete('/groups/:id', 'Admin/GroupsController.destroy')
      .as('groups.destroy')

    Route
      .get('/groups/:id', 'Admin/GroupsController.show')
      .as('groups.show')

    Route
      .patch('/groups/:id', 'Admin/GroupsController.update')
      .as('groups.update')

    Route
      .post('/add/group/:id', 'Admin/GroupsController.addGroup')
      .as('add.groups')
    Route
      .delete('/delete/:userid/group/:id', 'Admin/GroupsController.removeUser')
      .as('remove.user')
  })
  .middleware('auth')
