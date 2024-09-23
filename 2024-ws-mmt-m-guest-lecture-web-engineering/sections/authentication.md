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

- Login function
  - Authenticate initially via local ore OAuth strategy
- Logout function
  - Authenticate with JWT
- Guards for according authentication levels
  - Local and JWT