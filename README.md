# js13kgames-2019

[js13kgames](http://js13kgames.com/) 2019 labs, generated with [js13k-webpack-starter](https://github.com/sz-piotr/js13k-webpack-starter)


## Local development

```
yarn install
yarn start
```

This will setup a server listening at `http://localhost:8080/`.

### Access from another device

You can pass an argument to the development server specifying the interface to listen on.
```
yarn start -- --host=0.0.0.0
```

This command will start the development server listening on all interfaces. Having a device on the same network you will be able to view the webpage at `http://[yourLocalIP]:8080` for example `http://192.168.1.1:8080`.

## Build

This project provides a yarn script for building your application. Just run:
```
yarn build
```

This will generate two files `index.html` and `build.zip` both located in the `dist/` folder. The zip file contains only the generated `index.html`. The output from the command also tells you how large is the generated zip file.

## ES2015+ support

This game requires browser with ES2015+ support

## Resources

1. Webpack https://webpack.js.org/
1. js13k-webpack-starter https://github.com/sz-piotr/js13k-webpack-starter)
