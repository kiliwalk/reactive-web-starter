Simple and lucid reactive web starter project
=================================

## Fetures
* stylus style
* react-router
* API proxy
* Global state managed(use umc)
* Custom dev server
* Split app.js/app.css/vendor.js, and all with hash
* SSR(Server side render). Not fully tested. Not recommend to use SSR. 

## Installation
1. Run `git clone` and  `npm i`
2. In `src/config/client` dir, `cp defaults.js my.js`. Change my.js as you want
3. In `src/config/server` dir, `cp defaults.js my.js`. Change my.js as you want
4. Run `npm run start-dev` and open browser with `http://localhost:8083`.

## Usage
Add your own files in `components`, `store/routers`, `styles` dirs.

## Server Side Render
To enable and use SSR:

* Currently only support production environment
* Start with `ENABLE_SSR=true`(see `npm run start-ssr` script)
* Make sure that the component has the static method `serverLoad`, which is used to get the initial state.

## License

Licensed under MIT

Copyright (c) 2016 kiliwalk
