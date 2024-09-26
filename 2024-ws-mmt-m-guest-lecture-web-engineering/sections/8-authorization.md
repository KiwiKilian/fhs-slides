---
layout: section
hideInToc: false
---

# Authorization


---

# [CASL](https://casl.js.org)

- Authorization library
- Restricts what resources can be accessed by the user
- Fits small to large role and authorization systems
- Works by describing abilities in MongoDB query language
- Isomorphic, can be applied in all JS frameworks (frontend and backend)
- Rules can be serialized for the frontend

---

# Defining abilities

```ts
type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, Article, { authorId: user.id });
    cannot(Action.Delete, Article, { isPublished: true });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
```

---

# Can?

```ts
const ability = this.caslAbilityFactory.createForUser(user);
if (ability.can(Action.Read, 'all')) {
  // "user" has read access to everything
}
```

- Can also transform into a [guard](https://docs.nestjs.com/security/authorization#advanced-implementing-a-policiesguard)