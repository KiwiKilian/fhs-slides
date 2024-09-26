---
layout: section
hideInToc: false
---

# Validation

---

# [OWASP Top 10: A03:2021 – Injection](https://owasp.org/Top10/A03_2021-Injection/)

An application is vulnerable to attack when:

- User-supplied data is not validated, filtered, or sanitized by the application.
- Dynamic queries or non-parameterized calls without context-aware escaping are used directly in the interpreter.
- Hostile data is used within object-relational mapping (ORM) search parameters to extract additional, sensitive records.
- Hostile data is directly used or concatenated. The SQL or command contains the structure and malicious data in dynamic queries, commands, or stored procedures.

---

# Validation Pipes

Built in:

- `ValidationPipe`
  - Uses the [`class-validator`](https://github.com/typestack/class-validator) package
- `ParseIntPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`

---

# Body with `class-validator`

The package allows to annotate DTOs with [large amount of decorators](https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators):

```ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

---

# Example: GeoJSON

```ts
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsString, Max, Min } from 'class-validator';
import { Point } from 'geojson';

export class PointDto implements Point {
  @IsString()
  @ApiProperty({ oneOf: [{ type: 'string', enum: ['Point'] }] })
  type: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber(undefined, { each: true })
  @Min(-180, { each: true })
  @Max(180, { each: true })
  coordinates: number[];
}
```

---

```ts
@Post()
initialize(@Body() createUserDto: CreateUserDto) {
  return "This actions returns new created user";
}
```

---

# Parameters with `class-validator`

Can also be used to validate (query) parameters:

```ts
import { IsNumberString } from 'class-validator';

export class FindOneSearchParams {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
```

Controller:

```ts
@Get()
findAll(@Query() searchParams: FindOneSearchParams) {
  return 'This action returns a users';
}
```

---
transition: slide-left
---

# Global Validation Pipe

- Add this `ValidationModule` to `imports` in `AppModule` to globally apply

```ts
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
          exceptionFactory: (errors) => new BadRequestException(errors),
        }),
    },
  ],
})
export class ValidationModule {}
```
