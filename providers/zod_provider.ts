/*
 * @eliasmorio/zod
 *
 * (c) Elias Morio
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationService } from '@adonisjs/core/types'
import { Request } from '@adonisjs/core/http'
import { ZodRequestValidator } from '../src/zod_request_validator.js'

/**
 * Extend HTTP request class
 */
declare module '@adonisjs/core/http' {
  interface Request extends ZodRequestValidator {}
}

/**
 * The Zod service provider configures Zod to work within
 * an AdonisJS application environment
 */
export default class ZodServiceProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    Request.macro('validateUsing', function (this: Request, ...args) {
      return new ZodRequestValidator(this.ctx!).validateUsing(...args)
    })
  }
}
