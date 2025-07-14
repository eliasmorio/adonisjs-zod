/*
 * @emorio/adonisjs-zod-validator
 *
 * (c) @github/eliasmorio
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpContext } from '@adonisjs/core/http'
import z, { ZodType } from 'zod'

/**
 * Request validator is used validate HTTP request data using
 * Zod validators. You may validate the request body,
 * files, cookies, and headers.
 */
export class ZodRequestValidator {
  #ctx: HttpContext

  constructor(ctx: HttpContext) {
    this.#ctx = ctx
  }

  /**
   * The validate method can be used to validate the request
   * data for the current request using Zod validators
   */
  validateUsing<Schema extends ZodType>(validator: Schema): Promise<z.output<Schema>> {
    /**
     * Data to validate
     */
    const data = {
      ...this.#ctx.request.all(),
      params: this.#ctx.request.params(),
      headers: this.#ctx.request.headers(),
      cookies: this.#ctx.request.cookiesList(),
    }

    return validator.parseAsync(data)
  }
}
