---
layout: section
hideInToc: false
---

# Sending E-Mails

---

# DIY mail sending

- Use [`nodemailer`](https://github.com/nodemailer/nodemailer) through [`@nestjs-modules/mailer`](https://github.com/nest-modules/mailer)
- Easy to configure your SMTP access
- Comes with templating
- Or even better with [`react-email`](https://github.com/resend/react-email)
- SMTP is easy to get at any webhoster, provides enough functionality for most midsize projects

---

# How to send mails in development

- Wanting to test email delivery to multiple mails
  - Could use e-mail aliases like plus-aliasing and real SMTP: slug+alias@most-big-mail-companies.com
- Customers are often late to deliver their SMTP credentials
- Don't really want so send mails to any real user

---

# ~~Mailhog~~ [Mailpit](https://github.com/axllent/mailpit?tab=readme-ov-file)

- Local SMTP
- Catch-all
- Web mail client
- REST API for testing
- [Can I email integration](https://www.caniemail.com/)

---

# Setup Mailpit within Docker Compose

```yml
services:
  mailhog:
    image: axllent/mailpit
    ports:
      - 1025:1025 # SMTP
      - 8025:8025 # Web interface
```

---
transition: slide-left
---

# Testing

- Use `cheerio` for HTML parsing

```ts
const mailpit = {
  async latestTo(email: string) {
    return (await fetch(`http://localhost:8025/view/latest.html?query=to:${email}`)).text();
  },
};
```

```ts
it('sends mail on intialization', async () => {
  await agent().post('/password-reset').send({ email: E2E_SEED_EDITOR_EMAIL }).expect(201);

  const mailHtml = await mailpit.latestTo(E2E_SEED_EDITOR_EMAIL);

  expect(mailHtml).toBeDefined();
  const $ = cheerio.load(mailHtml);
  expect($('h1').contents().first().text()).toEqual('Passwort zurücksetzen');
});
```
