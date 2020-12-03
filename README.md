# We Sell Houses - jansonsa 304CEM coursework (frontend)
We Sell Houses is a Single Page Application (SPA) created with React. It allows users (estate agents) to list houses for sale to the general public.

## Initial setup

1. Clone this repository.
1. Install all dependencies with `yarn install` or `npm install`.

## Running the app

1. To run the app in development mode, run `yarn start` or `npm start`.
1. The app will be accesible by navigating to [http://localhost:3000](http://localhost:3000) in the browser.
1. The page will automatically reload if you make edits.
1. You will also see any lint errors in the console.

## Testing the app

1. Run `yarn test` or `npm test`.
1. The test results will be visible in the console.

## Documentation

The code is documented using JSDoc with the addition of better-docs plugin. This allows the documentation to be organised based on components and provides a nicer user interface.

To access the documentation:
1. Run `yarn docs` or `npm run docs`.
1. The documentation will be generated in [/docs](/docs) directory.
1. Open the [/docs/index.html](/docs/index.html) with any browser and start exploring.

## Building the app

1. Run `yarn build` or `npm run build`.
1. It will bundle the SPA in production mode and optimize it for best performance. See [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
1. The built files will be located in [/build](/build) directory.

## Configuration

- To configure the base URL of the backend API, modify [.env](.env) file.
- Since this app was created using [Create React App](https://create-react-app.dev/), all the webpack and other related configuration has been encapsulated. It can be accessed directly by running `yarn eject`, however this would add many files to the source control and would make maintainability much harder. Instead I am using [react-app-rewired](https://github.com/timarney/react-app-rewired) which only exposes a single [config-overrides.js](config-overrides.js) that allows to configure webpack config in a much cleaner way.

## Troubleshooring

This app with all of its node_modules has a size of **~370MB**. This means that it cannot run in the codio environment as it allocated only around 400MB of space per machine. Attempting to run `yarn install` or `npm install` would most likely fail, and even if it did succeed, it would cause the codio environment to become very slow.
