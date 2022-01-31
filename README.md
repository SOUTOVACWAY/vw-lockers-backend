# Vacway Backend

Prerequisites:

- Node (>= 6.x)
- MongoDB (>= 3.4)

## Development guide

First of all install the required dependencies:

```sh
npm install
```

Then, you can start the backend in development mode like this:

```sh
npm run dev
```

## Database

On development the `vacway-dev` database found in `localhost` is used. It is
assumed that the database has the `vacway-dev` user with password `vacway-dev`.
You can also seed the database with test data like this:

```sh
node seeds/test-data.js
```
