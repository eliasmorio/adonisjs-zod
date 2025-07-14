# Zod Validator for AdonisJS

A lightweight, type-safe request validation package for AdonisJS that leverages the power of [Zod](https://zod.dev/) schemas instead of VineJS.

## Features

- 🔍 **Type-safe validation**: Full TypeScript support with inferred types from Zod schemas
- 🚀 **Easy integration**: Seamlessly integrates with AdonisJS request lifecycle
- 📦 **Comprehensive validation**: Validates request body, files, params, headers, and cookies
- 🎯 **Familiar API**: Simple `validateUsing()` method added to AdonisJS request object
- 🛠 **Flexible**: Use any Zod schema, including complex nested validations

## Installation

Install the package using npm, yarn, or pnpm:

```bash
npm install @emorio/zod-validator zod
```

```bash
yarn add @emorio/zod-validator zod
```

```bash
pnpm add @emorio/zod-validator zod
```

## Configuration

### 1. Register the Provider

Add the provider to your `adonisrc.ts` file:

```typescript
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  // ... other config
  providers: [
    // ... other providers
    () => import('@emorio/zod-validator/zod_provider'),
  ],
})
```

## Usage

### Basic Validation

```typescript
import { HttpContext } from '@adonisjs/core/http'
import { z } from 'zod'

// Define your Zod schema
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.email(),
  age: z.number().int().min(18),
})

export default class UsersController {
  async store({ request, response }: HttpContext) {
    try {
      // Validate request data
      const validatedData = await request.validateUsing(createUserSchema)

      console.log(validatedData.username) // TypeScript knows this is a string

      // Create user with validated data
      // ... your logic here

      return response.json({ message: 'User created successfully' })
    } catch (error) {
      return response.status(422).json({ errors: error.errors })
    }
  }
}
```

### Advanced Validation with Headers and Params

```typescript
import { HttpContext } from '@adonisjs/core/http'
import { z } from 'zod'

export default class PostsController {
  async update({ request, response }: HttpContext) {
    const updatePostSchema = z.object({
      // Request body validation
      title: z.string().min(1).max(255),
      content: z.string().min(10),
      published: z.boolean().optional(),

      // Route params validation
      params: z.object({
        id: z.string().uuid(),
      }),

      // Headers validation
      headers: z.object({
        'content-type': z.string(),
        'authorization': z.string().startsWith('Bearer '),
      }),

      // Cookies validation (optional)
      cookies: z
        .object({
          session_id: z.string().optional(),
        })
        .optional(),
    })

    const validatedData = await request.validateUsing(updatePostSchema)

    // Access validated data with full type safety
    const postId = validatedData.params.id
    const authToken = validatedData.headers.authorization
    const title = validatedData.title

    // ... your logic here
  }
}
```

## API Reference

### `request.validateUsing<Schema>(schema: Schema): Promise<z.infer<Schema>>`

Validates the incoming request data using the provided Zod schema.

**Parameters:**

- `schema`: A Zod schema to validate against

**Returns:**

- `Promise<z.output<Schema>>`: The validated and typed data

**Validation Data Sources:**
The method automatically validates data from:

- Request body (`request.all()`)
- Route parameters (`request.params()`)
- Request headers (`request.headers()`)
- Cookies (`request.cookiesList()`)

**Error Handling:**
Throws a Zod validation error if validation fails. Handle this in your exception handler or with try/catch blocks.

## Error Handling

### Global Exception Handler

Create a custom exception handler to format Zod validation errors:

```typescript
import { errors } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { ZodError } from 'zod'

export default class HttpExceptionHandler extends errors.HttpExceptionHandler {
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof ZodError) {
      // z.treeifyError(error);
      // handle the error
    }

    return super.handle(error, ctx)
  }
}
```

## Roadmap & Enhancements

### Planned Features

- [ ] **ace add command**: Add support for registering by using the node ace add command
- [ ] **Tuyau Integration**: Generate Tuyau api and types with this zod schema
- [ ] **Custom File Validators**: Enhanced file validation similar to VineJS file validators
  - File size validation
  - MIME type validation
  - Image dimension validation
  - Custom file upload rules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

Run the test suite:

```bash
npm test
```

## Requirements

- Node.js >= 20.6.0
- AdonisJS >= 6.2.0
- Zod >= 4.0.0

## License

This package is open-sourced software licensed under the [MIT license](LICENSE.md).

## Credits

- Built for [AdonisJS](https://adonisjs.com/)
- Powered by [Zod](https://zod.dev/)
- Created by [eliasmorio](https://github.com/eliasmorio)

---

**Need help?** Open an issue on [GitHub](https://github.com/eliasmorio/adonisjs-zod-validation/issues) or start a discussion.
