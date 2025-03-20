# Database Setup

## Start the Database

Run the following command to start the database using Docker Compose:

```bash
docker-compose up -d
```

## Run Migrations

Apply the latest database migrations using Prisma:

```bash
bun prisma migrate deploy
```

## Running the Project

Ensure the database is running, then start your application:

```bash
bun run backend
```

That's it! Your database is ready to use. 🚀
