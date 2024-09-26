---
layout: section
hideInToc: false
---

# TypeORM

---

- Great integration with NestJS
- Stable library for bridging TypeScript into the database world
- Support for a large amount of databases
  - MySQL
  - MariaDB
  - Postgres
  - CockroachDB
  - SQLite
  - Microsoft SQL Server
  - Oracle
  - SAP Hana
  - MongoDB
- Same decorator spirit

---

# Setup

- During development, we can use `synchronize`, which will always try to update the db scheme to our current definition
- Now `DataSource` and `EntityManager` can be injected into services

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

---

# Setup PostgreSQL with Docker Compose

- Using PostGIS extension for spatial data

```yml
services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    environment:
      POSTGRES_USER: $POSTGRES_USER
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
      LANG: de_DE.utf8
      TZ: Europe/Vienna
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - 5432:5432

volumes:
  postgres-data:
```

---

# Entity

```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column('enum', { enum: UserStatus, default: UserStatus.INVITED })
  status: UserStatus;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
```

---

# CRUD

```ts {all|3|5-7|9-11|12-15|16-21|23-27}{maxHeight:'100%'}
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(this.usersRepository.create(createUserDto));
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneByOrFail({ id });

    return this.usersRepository.save(Object.assign(user, updateUserDto));
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneByOrFail({ id });

    return this.usersRepository.remove(user);
  }
}

```

---

# Transactions

Either all operations finish or the whole transaction will be rolled back:

```ts
async createMany(users: User[]) {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(users[0]);
    await queryRunner.manager.save(users[1]);

    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
}
```

---

# CLI & Scripts

- Use `ts-node` to read `ormconfig.ts`
- `db:reset` can quickly reset the database and seed in development

```json
"typeorm": "ts-node --require tsconfig-paths/register ./node_modules/typeorm/cli --dataSource src/ormconfig.ts",
"typeorm-seeding": "ts-node --require tsconfig-paths/register ./node_modules/@jorgebodega/typeorm-seeding/dist/cli --dataSource src/ormconfig.ts",
"db:reset": "npm run db:reset:postgres",
"db:reset:postgres": "npm run typeorm schema:drop && npm run typeorm schema:sync && npm run typeorm-seeding seed src/seeds/development.seeder.ts"
```

---

# Migrations

- Your database scheme might change over time
- Supports up and down migrations
- Disable `synchronize`, enable `migrationsRun`
- Generate a migration with the CLI `npm run typeorm migration:generate src/migrations/AddEmailToUser`

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToUser1720169932029 implements MigrationInterface {
  name = 'AddEmailToUser1720169932029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "email" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
  }
}
```

---
transition: slide-left
---

# Seeding

- Important for a great development flow is example data
- Current best option is [@jorgebodega/typeorm-seeding](https://github.com/jorgebodega/typeorm-seeding)
- Run with `npm run typeorm-seeding seed src/seeds/admins.seeder.ts`

```ts
export class AdminsSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const usersRepository = dataSource.getRepository(User);

    await usersRepository.save(
      [{ email: 'hello@example.com' }].map((user) =>
        usersRepository.create({
          ...user,
          status: UserStatus.ACTIVE,
          role: UserRole.ADMIN,
          password: DEVELOPMENT_SEED_PASSWORD,
        }),
      ),
    );
  }
}
```
