# Todo App PWA

A simple Todo App that uses a service worker to cache assets and send push notifications.

## Running locally

Install dependencies for both the client (root) and the server:

**Client**

From project root:

```
yarn install
yarn build
serve -s build
```

**Server**

```
cd server
yarn install
yarn start # Will generate keys for you if you don't have them
```


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Added [react-app-rewired](https://github.com/timarney/react-app-rewired#readme) to get greater control over the service worker.
