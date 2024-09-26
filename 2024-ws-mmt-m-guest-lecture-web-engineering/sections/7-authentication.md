---
layout: section
hideInToc: false
---

# Authentication

---

# Authentication

- Who is using the application?
  - Authenticate the user with credentials
- Integrated with [Passport.js](https://www.passportjs.org/)
  - Supports many different authentication strategies:
    - Local (password in your database)
    - JWT (JSON Web Token)
    - HTTP Bearer (Header)
    - OAuth (Authenticate with many different providers like Facebook, Google, GitHub...)

---

# Components for Authentication Flow

- Login
  - Authenticate initially via local or OAuth strategy (guard)
  - Return JWT (cookie or body)
- Authenticated
  - Authenticate with JWT (guard)
- Logout function
  - Remove cookie or token from database if saved

---

# Local Strategy

Add this strategy to the providers of the `AuthenticationModule`:

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationService } from '@/authentication/authentication.service';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      return await this.authenticationService.validateLocalUser(email.toLowerCase(), password);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
```

---

# Validate local User

```ts
@Injectable()
export class AuthenticationService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async validateLocalUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { email: email.toLowerCase(), status: UserStatus.ACTIVE },
      relations: { tenants: true },
    });

    if (await user.comparePassword(password)) {
      return user;
    }

    throw new Error('AuthenticationService password mismatch.');
  }
}
```

---

# Manage User Password

```ts
  @ApiHideProperty()
@Column('text')
@Exclude()
password: string;

@ApiHideProperty()
@Exclude()
previousPassword?: string;

@AfterLoad()
private setPreviousPassword(): void {
  this.previousPassword = this.password;
}

@BeforeInsert()
@BeforeUpdate()
private emailToLowerCase() {
  this.email = this.email.toLowerCase();
}

@BeforeInsert()
@BeforeUpdate()
private async hashPassword() {
  if (this.password !== null && this.previousPassword !== this.password) {
    this.password = await argon2.hash(this.password);
  }
}

async comparePassword(attempt: string) {
  return this.password !== null && argon2.verify(this.password, attempt);
}
```

---

# Local Guard

`src/authentication/guards/local-authentication.guard.ts`

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}
```

---

# Login Endpoint

```ts
@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Public()
  @Post()
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 201, type: User })
  async login(@Request() request: RequestWithUser) {
    const { user } = request;
    this.authenticationService.setJwtCookieLogin(request, user);

    return user;
  }
}
```

---

# JWT – JSON Web Token

- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519): Method for representing claims securely between two parties
- Anyone can decode, it's not secret
- Signed with a secret on the server, thereby server can verify authenticity
- Can include some data of the user
  - Can provide information to the client (e.g. profile data, some UI authorization based on role in SPAs)
  - Server can omit another SQL select of the user, if not prone to update/changes of the user
- Structured like:

```
header.payload.signature
```

---

# Configure JWT Module

```ts
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME', { infer: true }) },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthenticationModule {}
```

---

# Creating a JWT Cookie

```ts {5|8-21|23-37}{maxHeight:'100%'}
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  setJwtCookieLogin(request: Request, { id, email }: User) {
    const payload: JwtPayload = { user: { id, email } };
    const token = this.jwtService.sign(payload);

    request.res?.setHeader(
            'Set-Cookie',
            this.getSetCookie({
              value: token,
              options: { maxAge: this.configService.get('JWT_EXPIRATION_TIME', { infer: true }) },
            }),
    );
  }

  private getSetCookie({
    value,
    options,
  }: {
    value: string;
    options?: Omit<cookie.CookieSerializeOptions, 'httpOnly' | 'path' | 'sameSite' | 'secure'>;
  }) {
    return cookie.serialize(this.configService.get('JWT_COOKIE_NAME', { infer: true }), value, {
      ...options,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: this.configService.get('JWT_COOKIE_SECURE', { infer: true }),
    });
  }
}
```

---

# Client without cookies?

- Clients except browser might not have a concept of cookies
  - Server API clients
  - Native apps
- Return the token in the response
- Care for secure storage of the token

---

# JWT Strategy

Add this strategy to the providers of the `AuthenticationModule`:

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly authenticationService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.[this.configService.get('JWT_COOKIE_NAME', { infer: true })],
      ]),

      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', { infer: true }),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.authenticationService.validateJwtUser(payload);

      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
```

---

# JWT Guard

```ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '@/authentication/decorators/public.decorator';

@Injectable()
export class JwtAuthenticationGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

---

# Public Decorator

`src/authentication/decorators/public.decorator.ts`

```ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

---

# Protect all Routes

```ts
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
})
export class AuthenticationModule {}
```
