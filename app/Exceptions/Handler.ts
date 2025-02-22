/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected disableStatusPagesInDevelopment = false
  protected attemptChances = 5

  protected statusPages = {
    '404': 'errors.not-found',
    '500..599': 'errors.server-error'
  }

  constructor() {
    super(Logger)
  }

  public async handle(error, ctx: HttpContextContract) {
    if (error.code === 'E_INVALID_AUTH_PASSWORD') {
      ctx.session.increment('AUTH_ATTEMPTS', 1)
      if (ctx.session.get('AUTH_ATTEMPTS') === this.attemptChances) {
        // @todo dezactiveaza contul timp de x minute
      }
    }
    return super.handle(error, ctx)
  }
}
