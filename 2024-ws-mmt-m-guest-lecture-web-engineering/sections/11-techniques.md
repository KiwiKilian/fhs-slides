---
layout: section
hideInToc: false
---

# Techniques

---

# [Caching](https://docs.nestjs.com/techniques/caching)

- Defaults to an in-memory cache
  - Switchable to Redis
- Can be injected or globally provided
- Manual access with `set` and `get`
- Auto caching of responses with interceptor possible

```ts
@Controller()
@UseInterceptors(CacheInterceptor)
@CacheTTL(50)
export class AppController {
  @CacheKey('custom_key')
  @CacheTTL(20)
  findAll(): string[] {
    return [];
  }
}
```

---

# [Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)

- Easy cronjobs with decorators in services
- Dynamic planning with scheduler registry

```ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }
}
```

---

# [Queues](https://docs.nestjs.com/techniques/queues)

- Even processing peaks: Define how many tasks processed in parallel and pull from the queue when available
- Doesn't block the Node.js event loop
- Communication about long-running tasks by listening to status events
- Uses Redis for saving the queue state

```ts
BullModule.forRoot({
  connection: {
    host: 'localhost',
    port: 6379,
  },
});
```

```ts
BullModule.registerQueue({
  name: 'image',
});
```

```ts
const job = await this.imageQueue.add('transform', {
  imagePath: 'some-path',
});
```

[//]: # (TODO Consumer)

---

# Health

Adding an health check endpoint for external monitoring:

```ts
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([() => this.typeOrmHealthIndicator.pingCheck('postgres')]);
  }
}
```

```json
{
  "status": "ok",
  "info": { "postgres": { "status": "up" } },
  "error": {},
  "details": { "postgres": { "status": "up" } }
}
```

---

# Logging

- Log your own events with the built-in logger

```ts
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Doing something...');
  }
}
```

---
transition: slide-left
---

# Error Monitoring with Sentry

- Monitor your errors
  - Stacktraces
  - Breadcrumbs
- [SDK for NestJS](https://docs.sentry.io/platforms/javascript/guides/nestjs/) currently in beta
- Note: US service requires privacy consideration

<img width="600" src="/assets/sentry.png">
