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

```ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly invitationService: InvitationsService,
  ) {}

  async create({ createUserDto }: { createUserDto: CreateUserDto }) {
    let user;

    try {
      user = await this.usersRepository.save(this.usersRe - pository.create(createUserDto));
    } catch (error) {
      throw handleQueryError(error, createUserDto);
    }

    return this.invitationService.invite({ user });
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return this.usersRepository.findOneOrFail({ where: { id }, relations: { tenants: { tenant: true } } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });

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

# Migrations

- Your database scheme might change over time
- Supports up and down migrations
- Disable `synchronize`, enable `migrationsRun`

---
transition: slide-left
---

# Seeding

- Important for a great development flow is example data
- Current best option is [@jorgebodega/typeorm-seeding](https://github.com/jorgebodega/typeorm-seeding)

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
