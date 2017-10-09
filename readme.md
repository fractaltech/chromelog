# chromelog - 1.0.2
### Because sometimes, all you need is a `console.log` in chrome.

## We follow `breaking.feature.fix` versioning

This project came out of the frustrations faced when developing on [react-native](https://facebook.github.io/react-native/), and trying to "debug in chrome", just because I needed the good old `console.log` inside chrome so I could explore objects that I want to explore.

(for those who are not aware, __react-native's "debug in chrome"__ gives you the full fledged chrome debugger for react-native, but __makes your app crawl__, and __makes you cry__)

### Usage:
`npm install --save chromelog`

And add `"chromelog": "chromelog"` under the `"scripts"` key in your project's `package.json`. It should look something like this:

```json
{
  "name": "AwesomeReactNativeAppOrSomeOtherProject",
  "version": "0.9.0",
  "description": "Log stuff from anywhere into chrome",
  "main": "index.js",
  "scripts": {
    ...
    "chromelog": "chromelog"
  },
  ...
}
```

Now you can start the chromelog server by running this command from your project root: `npm run chromelog`

When you run this command, you'll see something like this:

![chromelog screenshot](http://i.imgur.com/yguXOjf.png)

This will show you your __chromelog endpoint__ to for various networks your dev-machine is connected to. __Copy the chromelog endpoint__ you'll need it real soon.

And your browser will open up, which will show you something like this if you open up the console too

![browser screenshot](http://i.imgur.com/TITA2gN.png)

### Logging things for react-native

Almost there. In the root of your react-native project, you can see the files `index.android.js` and `index.ios.js`. These are __entry points__ into your app. At the top of these files, where all the `import`s and `require`s are, add one of the following for `chromelog`.

```js
const chromelog = require('chromelog') // OR
import chromelog from 'chromelog'
```

At the bottom, you will see something like this:

`AppRegistry.registerComponent('FormApp', () => FormApp);`

Just before it, set the __chromelog endpoint__ that you previously copied. Like this:

```js
chromelog.endpoint = 'http://192.168.43.218:1989';

AppRegistry.registerComponent('FormApp', () => FormApp);
```

Now just use `chromelog` wherever you want in your project, and you can __see console.log in chrome__ *without react-native's "debug in chrome"* . Example

```js
const chromelog = require('chromelog') // OR
import chromelog from 'chromelog'

class Foo extends Component {
  ...
  componentWillMount() {
    chromelog(this.props.user);
  }
  ...
}
```

Here's a screenshot

![chromelog demo](http://i.imgur.com/RY8i4En.png)

* You can also install `chromelog` globally, but you do need to install it in the project where you plan to use it, so just skip the global install I'd say. With node, never install anything globally.

* Full chromelog script arguments below
```json
{
  "scripts": {
    ...
    "chromelog": "chromelog <port> <host>"
  },
}
```
