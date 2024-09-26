---
layout: section
hideInToc: false
---

# Serialization

---

# Serialization

- Transformation before returning a network response
- Important to sanitize data for the client
  - Omit secret fields like passwords
  - Only return partial data
- Add additional/computed fields to classes
- Implemented with `class-transformer`

---

# Excluding a field

Through `@Exclude()` the `password` field will be omitted during serialization from the response:

```ts
class User {
  id: string;

  email: string;

  @Exclude()
  password: string;
}
```

---

# Exposing a field

Through `@Expose()` the `fullName` field will be serialized into the response:

```ts
@Expose()
get fullName(): string {
  return `${this.firstName} ${this.lastName}`;
}
```

---
transition: slide-left
---

# Global Class Serialization Interceptor

- Requires to return classes from controllers
- Add this `SerializationModule` to `imports` in `AppModule` to globally apply

```ts
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({ providers: [{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }] })
export class SerializationModule {}
```
