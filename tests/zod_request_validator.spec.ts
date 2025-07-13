/*
 * @adonisjs/core
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { IgnitorFactory } from '@adonisjs/core/factories'
import { TestUtilsFactory } from '@adonisjs/core/factories'
import { z, ZodError } from 'zod'

const BASE_URL = new URL('./tmp/', import.meta.url)

test.group('Request validator', () => {
  test('perform validation on request data using request validator', async ({
    assert,
    expectTypeOf,
  }) => {
    assert.plan(1)

    const ignitor = new IgnitorFactory()
      .withCoreConfig()
      .merge({
        rcFileContents: {
          providers: [
            () => import('@adonisjs/core/providers/app_provider'),
            () => import('../providers/zod_provider.js'),
          ],
        },
      })
      .create(BASE_URL)

    const testUtils = new TestUtilsFactory().create(ignitor)
    await testUtils.app.init()
    await testUtils.app.boot()
    await testUtils.boot()

    const ctx = await testUtils.createHttpContext()
    const validator = z.object({
      username: z.string().min(1, 'username is required'),
    })

    ctx.request.__raw_files = {}

    try {
      await ctx.request.validateUsing(validator)
    } catch (error) {
      console.log(error)
      assert.deepEqual(error, [
        {
          field: 'username',
          message: 'The username field must be defined',
          rule: 'required',
        },
      ])
    }
  })

  test('pass validation when data is valid', async ({ assert, expectTypeOf }) => {
    const ignitor = new IgnitorFactory()
      .withCoreConfig()
      .merge({
        rcFileContents: {
          providers: [
            () => import('@adonisjs/core/providers/app_provider'),
            () => import('../providers/zod_provider.js'),
          ],
        },
      })
      .create(BASE_URL)

    const testUtils = new TestUtilsFactory().create(ignitor)
    await testUtils.app.init()
    await testUtils.app.boot()
    await testUtils.boot()

    const ctx = await testUtils.createHttpContext()
    const validator = z.object({
      username: z.string(),
    })

    ctx.request.__raw_files = {}
    ctx.request.setInitialBody({ username: 'virk' })

    const output = await ctx.request.validateUsing(validator)
    assert.deepEqual(output, { username: 'virk' })
    expectTypeOf(output).toEqualTypeOf<{ username: string }>()
  })

  test('validate headers', async ({ assert, expectTypeOf }) => {
    const ignitor = new IgnitorFactory()
      .withCoreConfig()
      .merge({
        rcFileContents: {
          providers: [
            () => import('@adonisjs/core/providers/app_provider'),
            () => import('../providers/zod_provider.js'),
          ],
        },
      })
      .create(BASE_URL)

    const testUtils = new TestUtilsFactory().create(ignitor)
    await testUtils.app.init()
    await testUtils.app.boot()
    await testUtils.boot()

    const ctx = await testUtils.createHttpContext()
    const validator = z.object({
      username: z.string(),
      headers: z.object({
        accept: z.string(),
      }),
    })

    ctx.request.request.headers['accept'] = 'json'
    ctx.request.__raw_files = {}
    ctx.request.setInitialBody({ username: 'virk' })

    const output = await ctx.request.validateUsing(validator)
    assert.deepEqual(output, { username: 'virk', headers: { accept: 'json' } })
    expectTypeOf(output).toEqualTypeOf<{ username: string; headers: { accept: string } }>()
  })
})
