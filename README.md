# WWW-project

You can find the website from https://www-project-red.vercel.app/

## Getting Started

First, install the package.

```bash
npm install
```

After, set the environment variables.
Example of env found from .env-example

1. Clerk

Sign in (or Sign up) for Clerk and create a new project in clerk dashboard (https://dashboard.clerk.com/)

Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to the .env

2. Planetscale

Create a new database in planetscale (https://planetscale.com/).

Set DATABASE_URL to newly created database url.

If you wish to use any other mysql database provider, you can modify the schema.prisma to your own database provider.

Finally, run the development environment

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Modifying the database

You can modify the data schema from the schema.prisma file.

Then:

```bash
npx prisma db push
npx prisma generate
npm i
```

## Developer environment

I recommend downloading these VSCode plugins:

1. Prettier
2. Tailwind CSS IntelliSense
3. Prisma
