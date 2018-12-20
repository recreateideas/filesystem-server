# filesystem-server

Node app to serve the filesystem over Localhost via API call.

## Installation

Use npm to install filesystem-server globally

```bash
npm install -g filesystem-server
```

## Usage
in your terminal run:
```bash
filesystem-server [port] [https port] #?optional default 2222 4444
```
## From Web App
1 - test the connectivity
```
const url = `http://localhost:${port}/testFSSConnection`
// or const url = `https://localhost:${httpsPort}/testFSSConnection`
const res = await fetch(url);
if (json.fssConnected === 'true') {
   // connected
} else {
   // not connected
}
```
2 - make GET requests to find your files

```
const url = `http://localhost:${port}/files/%2FUsers%2Frecreate%2Fdev.js`
// or const url = `https://localhost:${httpsPort}/files/%2FUsers%2Frecreate%2Fdev.js`
const fileSource = await fetch(url);
// ...
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

GitHub Repo: [https://github.com/recreateideas/filesystem-server.git](https://github.com/recreateideas/filesystem-server.git)

## Author
Recreate Ideas - 2018
## License
[MIT](https://choosealicense.com/licenses/mit/)
