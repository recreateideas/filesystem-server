# filesystem-server

Node app to serve the filesystem over Localhost via API call.

## Installation

Use npm to install filesystem-server globally

```bash
npm install -g filesystem-server #macOS
sudo npm install -g --unsafe filesystem-server #linux
```
So that you can connect via https the installation script will install a SSL key and certificate that are valid for 10 years.\
**If you have issues with those (https) please debug accordingly to your operative system. Otherwise try and stick to http.**\
*-Don't forget to add your certificates to your browser if using this with a web extension-*

## Usage - Terminal
in your terminal run:
```bash
filesystem-server [port] [https port] #?optional default 2222 4444
```
## Usage - Web
1 - test the connectivity
```
const testFSS = async() => {
   // ...
   const protocol = 'https' // or 'http'
   const port = '2222' // same port as you ran the 'filesystem- server' command with
   const url = `${protocol}://localhost:${port}/testFSSConnection`
   const res = await fetch(url);
   if (res.ok) {
      const json = await res.json();
      if (json.fssConnected === 'true') {
         // connected
      } else {
         // not connected
      }
      // ...
   } else {
      // handle error
   }
}

```
2 - make GET requests to find your files

```
const fetchFile = async() => {
   // ...
   const protocol = 'https' // or 'http'
   const port = '2222' // same port as you ran the 'filesystem- server' command with
   const filePath = '/Users/recreate/dev.js';
   filePath = encodeURIComponent(filePath); 
   const url = `${protocol}://localhost:${port}/files/${filePath}`
   const fileSource = await fetch(url);
   // ...
}

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

GitHub Repo: [https://github.com/recreateideas/filesystem-server.git](https://github.com/recreateideas/filesystem-server.git)

## Author
Recreate Ideas - 2018
## License
[ISC](https://choosealicense.com/licenses/isc/)
