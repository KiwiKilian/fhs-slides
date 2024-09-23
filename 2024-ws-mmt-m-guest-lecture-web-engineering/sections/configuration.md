---
layout: section
hideInToc: false
---

# Configuration

---

# Configuration

- Configuration is almost always necessary on backends
  - Differentiate environments
  - Omit secrets from repository
- Configuration module provides config values from `.env`
  - Based on `dotenv`
  - Validation
  - Type safety
  - Multiple configuration files

---

# Validation with [`joi`](https://github.com/hapijs/joi)

- Validation defaults to `joi`
- Requires validation schema and type

```ts {all|1-7|8-22}{maxHeight:'100%'}
type EnvironmentVariables = {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
```

---

# Validation with [`zod`](https://github.com/colinhacks/zod)

- Can be used via `validate`
- Type can be infered

```ts {all|1-7|9|11-18}{maxHeight:'100%'}
export const environmentVariablesSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string().regex(/^\d+$/).transform(Number),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: environmentVariablesSchema.parse,
    }),
  ],
})
export class AppModule {}
```

---

# Usage in standalone files

In any file/other configuration:

```ts
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { EnvironmentVariables } from '@/types/EnvironmentVariables';

config();

const configService = new ConfigService<EnvironmentVariables, true>();

configService.get('POSTGRES_HOST', { infer: true });
```

---
transition: slide-left
---

# Usage in service

Injected into some service:

```ts
@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService<EnvironmentVariables, true>) {}

  getHost() {
    return this.configService.get('POSTGRES_HOST', { infer: true });
  }
}
```
