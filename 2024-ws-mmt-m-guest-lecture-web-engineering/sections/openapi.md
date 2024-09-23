---
layout: section
hideInToc: false
---

# OpenAPI

---

# Why OpenAPI?

- OpenAPI specs describe you endpoints, parameters, bodies, responses
- Documentation for you API
- Can be used to generate clients in countless languages
- Compared to other type safe API variants, this is the most portable and available for all language (API and client alike)

---

# Setup

Add it to your app bootstrap in `main.ts`:

```ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

---

# Customization

- Provides many customization options for more complex cases
  - `operationIdFactory`: Customize operation ids which are often used for generated client names
  - `extraModels`: Add more models, not generated from code

---

# Parameters

- Reads Method, `@Body()`, `@Query()`, and `@Param()` in controllers
- Add specific responses with `@ApiResponse()`

```ts
@Post()
@ApiResponse({ status: 201, description: 'The record has been successfully created.'})
@ApiResponse({ status: 403, description: 'Forbidden.'})
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

- Decorate your DTOs with `@ApiProperty()`

```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    description: 'The age of a cat',
    minimum: 1,
    default: 1,
  })
  age: number;
}
```

---

# Enums

- Enums are per default a raw parameter
- Not reused across multiple usages

Combine them by setting the `enumName`:

```ts
export class CatDetail {
  @ApiProperty({ enum: CatBreed, enumName: 'CatBreed' })
  breed: CatBreed;
}
```

---

# CLI Plugin

Reduce your usage of `@ApiProperty()` by:

- Annotate all DTO properties with `@ApiProperty()` unless `@ApiHideProperty()` is used
- Set the required property depending on the question mark (e.g. `name?: string` will set `required: false`)
- Set the `type` or `enum` property depending on the type (supports arrays as well)
- Set the `default` property based on the assigned default value
- Set several validation rules based on `class-validator` decorators (if `classValidatorShim` set to `true`)
- Add a response decorator to every endpoint with a proper status and `type` (response model)
- Generate descriptions for properties and endpoints based on comments (if `introspectComments` set to `true`)
- Generate example values for properties based on comments (if `introspectComments` set to `true`)

---
transition: slide-left
---

# CLI Plugin – Benefits

This:

```ts
export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false, default: true })
  isEnabled?: boolean = true;
}
```

Can be reduced to:

```ts
export class CreateUserDto {
  email: string;
  password: string;
  isEnabled?: boolean = true;
}
```
