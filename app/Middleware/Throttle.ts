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
import AttemptException from 'App/Exceptions/AttemptException'
import { DateTime, Duration } from 'luxon'

export default class Throttle {
  protected async checkRequests(session: HttpContextContract['session'], maxAttempts: number, perSecond: number) {
    if (session.get('TIMESTAMP') === undefined)
      session.put('TIMESTAMP', DateTime.utc())
    session.increment('ATTEMPTS', 1)

    let attempt = session.get('ATTEMPTS'),
        timeZone: DateTime = DateTime.fromISO(session.get('TIMESTAMP')),
        duration: number = Duration.fromObject(timeZone.diffNow().toObject()).as('seconds')

    if (attempt >= maxAttempts && Math.abs(duration) < perSecond) {
      session.forget('ATTEMPTS')
      session.forget('TIMESTAMP')

      throw new AttemptException('Too many requests in such small interval of time.', 429, 'E_ATTEMPT_REQUESTS')
    }

    if (attempt >= maxAttempts) {
      session.forget('ATTEMPTS')
      session.forget('TIMESTAMP')
    }
    return true
  }

  public async handle (ctx: HttpContextContract, next: () => Promise<void>, attemptParam: string[]) {
    await this.checkRequests(ctx.session, Number(attemptParam[0]), Number(attemptParam[1]))
    await next()
  }
}
