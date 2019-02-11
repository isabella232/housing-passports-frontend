![Housing Passports](https://user-images.githubusercontent.com/1090606/51992204-7e143200-24a4-11e9-9dff-643d72c6865b.png)

# Housing Passports

The Housing Passports project is a collaboration with the World Bank to improve housing resilience.

The WB is interested in detecting specific construction features within geotagged Streetview imagery. Their goal is to find features that are potentially dangerous during earthquakes, high winds, floods, etc. A good example is their initial push in Guatemala where they were looking for "soft story" buildings. These are 2+ level structures that have large windows or garage doors on the ground floor -- the large openings correspond to a high risk that the building will collapse and pancake during earthquakes. Other features could include roof overhangs, building construction material, presence of gutters.

Their hope is to detect dangerous features in Streeview images using ML, reference the image's geotag to get a location, and rely on local groups to deploy fixes or improvements.

## Installation and Usage

The steps below will walk you through setting up your own instance of the project.

### Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v8 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/) Package manager

### Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

```
nvm install
```

Install Node modules:

```
yarn install
```

### Usage

#### Javascript configurations and environment variables

At times, it may be necessary to include options/variables specific to `production`, `staging` or `local` in the code. To handle this, there is a master config.js file. This file should not be modified.  Instead, modify one of:

- config/production.js - production settings
- config/staging.js - overrides the production settings for staging server
- config/local.js - local (development) overrides. This file is gitignored, so you can safely change it without polluting the repo.

By default `production.js` is always loaded and values are overridden by `staging.js` or `local.js` according to the environment.

Values overridable by environment variables are expressed between []:

- baseurl - Application base url [BASE_URL]
- mbtoken - Mapbox token [MB_TOKEN]
- mapillaryClientId - Mapillary client id [MAPILLARY_CLIENT_ID]

#### Starting the app

```
yarn serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

# Deployment
To prepare the app for deployment run:

```
yarn build
```
or
```
yarn stage
```
This will package the app and place all the contents in the `dist` directory.
The app can then be run by any web server.
