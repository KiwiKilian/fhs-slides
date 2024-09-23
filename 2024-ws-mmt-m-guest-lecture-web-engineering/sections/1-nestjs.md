---
layout: section
hideInToc: false
---

# NestJS

A progressive Node.js framework for building efficient, reliable and scalable server-side applications.

---

# NestJS[^1]

- Node.js meta framework
- Builds upon Express or Fastify (platform can be chosen)
  - Enables the usage of the platform specific middlewares and functions
- TypeScript focussed
- Batteries included variant of Express
- Opinionated: Gives you an architecture
  - OOP (Object Oriented Programming)
  - FP (Functional Programming)
  - FRP (Functional Reactive Programming)

<!-- Footer -->

[^1]: https://docs.nestjs.com/

---

# Contestants

- Express with Drizzle and tRPC (T3 app)
- Rails
- Laravel
- Symfony
- Django

---
layout: iframe
url: https://risingstars.js.org/2023/en/#section-nodejs-framework
---

---

# [OWASP Top 10: 2021](https://owasp.org/Top10/)

- Shows recurring vulnerabilities
- A well-structured frameworks can cover some security considerations

<img width="800" src="/assets/nestjs-owasp.png">

---

# Creating a project

```bash
npm i -g @nestjs/cli
nest new project-name --strict
```

Use `--strict` for TypeScript strictness.

Creates the following scaffold:

```
src
 |- app.controller.spec.ts    Controller with a single route
 |- app.controller.ts         The unit tests for the controller
 |- app.module.ts             Root module of the application.
 |- app.service.ts            Service with a single method
 |- main.ts                   Entry file, create the Nest application
```

---

# Service – One type of Provider

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

- Services provide the main business logic
- A provider (so also a service) can be injected as a dependency
  - See `@Injectable()` decorator

---

# Controller

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

- Gets the `AppService` injected
- Expose `getHello` as `/` URL path

---

# Module

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- By adding a service to the `providers`, it can be injected anywhere the housing module is added to `imports`

---

# `main.ts`

- Bootstrap your app
- Add global middleware
- `app.enableCors`
- `app.setGlobalPrefix`
- `app.enableVersioning`
- Setup Swagger viewer

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

---

# Using `nest` CLI

- When building a REST API often used:

```sh
nest generate resource
  What name would you like to use for this resource (plural, e.g., "users")?

users

  What transport layer do you use? (Use arrow keys)
❯ REST API
  GraphQL (code first)
  GraphQL (schema first)
  Microservice (non-HTTP)
  WebSockets
```

---

# Dependency Injection[^1]

Dependencies are supplied during runtime from outside.

- Separation of Concerns: Creation is separated from behavior
- Testability: Injected dependencies can easily be mocked
- Flexibility and Scalability: Easy to use common services in other parts of the app
- Memory Efficiency: Managed lifecycle of dependencies allows to exist as singletons

<!-- Footer -->

[^1]: https://medium.com/@Abdelrahman_Rezk/dependency-injection-in-nestjs-a-comprehensive-guide-with-examples-ea0fe4be1256

---

# Injection Scope

- Default: Single instance will be created for the whole lifetime of the app
- Request: New instance is created for every request
- Transient: New instance created for every consumer

---

# Exception Filters

- Built-in exception layer
- You can throw an implementation of `HttpException` from anywhere in the app
  - [Extensive list of statuses](https://docs.nestjs.com/exception-filters#built-in-http-exceptions) available
- Can transform errors to HTTP statuses
  - Example handles `EntityNotFoundError` from TypeORM (discussed later)

```ts
import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter extends BaseExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    super.catch(new NotFoundException(), host);
  }
}
```

---

# Pipes

- Can transform input data
  - Applies to: Parameter, query, body
  - Applies to: Integers, floats, arrays, booleans
- Can validate input data
  - Discussed later in more detail
- Can be bound global, controller or method scoped

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

---

# Guards

- Are responsible for checking authentication
  - Is the user logged in?
- Are responsible for checking authorization
  - Does the user have access to this resource?
- Will throw 403 forbidden when returning false
- Can be bound global, controller or method scoped

```ts
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    return roles.include(context.switchToHttp().getRequest().user.roles);
  }
}
```

---

# Interceptors

- Extra logic/transform before and after function execution
- Can be bound global, controller or method scoped

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

---
transition: slide-left
---

# Last Slide
