[![NPM](https://nodei.co/npm/filesystem-server.png)](https://nodei.co/npm/filesystem-server/)

![](https://img.shields.io/badge/built%20for-chrome%20extensions-blue.svg)
![](https://img.shields.io/badge/unpacked%20size-20.7kb-yellow.svg)
![](https://img.shields.io/badge/dependencies-up%20to%20date-orange.svg)
![](https://img.shields.io/badge/license-ISC-purple.svg)

# filesystem-server

Node app to serve the filesystem over Localhost via API call.\
Includes chockidar file watcher over websockets for hot reload.

## Pre-installation (Windows only)
>**Note** You will need *Powershell* installed. **Only arch x64 is supported at the moment**.

**1-** Download **OpenSSL** from this [page](https://slproweb.com/products/Win32OpenSSL.html),  [ [this one](https://slproweb.com/download/Win64OpenSSL_Light-1_1_1a.exe) works on my Windows 10].\
**2-** Run the installer and install the package in **C:\OpenSSL-Win64** (this is very important otherwise you won't be able to install your SSL certificates later on!)\
**3-** At the end of the installation it will ask you to make a donation.. follow your heart. Just dismiss the popup if you don't feel generous ( task manager might help there). \
**4-** Make sure your user has administrator privileges.


## Installation

**1-** Use npm to install filesystem-server globally

```bash
npm install -g filesystem-server #IN LINUX, add "--unsafe" flag if executing it as 'nobody' user
```
> **In Linux**, in case you haven't done it yet, run **npm config set prefix /usr/local** to be able to run this and other packages from the command line once installed globally. \
**In Windows**, make sure that your npm is configured correctly and that you packages are being installed where you want them to be installed.

So that you can connect via https the installation script will install a SSL key and certificate that are valid for 10 years.\
**These files are created through a postinstall script, this is why on the latest linux distributions you need to run the install with --unsafe.** 
> *- [add your certificates to your browser](https://support.securly.com/hc/en-us/articles/206081828-How-to-manually-install-the-Securly-SSL-certificate-in-Chrome) to avoid (harmless) warnings in your browser -*

**2-** Paste this in your Chrome address bar:
```
chrome://flags/#allow-insecure-localhost
```
You should see highlighted text saying:\
`Allow invalid certificates for resources loaded from localhost`

**3-** Click `Enable`

>-this is in case there were hiccups in the creation of your certificate-

## Usage - Terminal
in your terminal run:
```bash
filesystem-server [port] [https port] #?optional ?optional , default 2222 4444
```
## Usage - Fetch / Axios / WebSockets
**1-** Test the connectivity
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
**2-** Make GET requests to find your files

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
**3-** Connect to websockets to know when a file has change 
```
// ...
const protocol = https ? 'wss' : 'ws';
const url = `${protocol}://localhost:${localhostPort}/hotReload/`;
const payLoad = {
        fileSource, // local path to file
        hotReload, // bool
        thisTab, // id of chrome tab to refresh
        localhostPort,
        https, // bool
        watchJSON,
};
const connection = new WebSocket(url);
if (connection) {
        connection.onerror =  (error) => {
                console.log(error);
        };
        connection.onopen =  () => {
                connection.send(JSON.stringify(payLoad));
        };
        connection.onmessage =  (msg) => {
                const json = JSON.parse(msg.data);
                const {
                    hotReload,
                    error,
                    thisTab,
                } = json;
                if (hotReload && !error) { reloadTab(thisTab); }
         };
}
// ...
```` 

**4-** Know your endpoints

```
    app.get('/exists/:filePath', doesFIleExist);

    app.get('/files/:filePath', handleFilePath);

    app.ws('/hotReload/', enableHotReload); // WebSocket

    app.get('/testFSSConnection', testConnection);

    app.post('/testWatchers', testWatchers);
```
>-for full code visit the [GitHub Repo](https://github.com/recreateideas/filesystem-server.git)

## Usage - Injector [Chrome Extension]

**1**- Install and launch Injector.\
**2**- Run `filesystem-server`\
**3**- Import your new SSL certificate (that you will find inside the node_modules/filesystem-server/security folder in your system library ) to Chrome (follow [this guide](https://support.securly.com/hc/en-us/articles/206081828-How-to-manually-install-the-Securly-SSL-certificate-in-Chrome)) or paste `chrome://flags/#allow-insecure-localhost` in Chrome address bar.\
**4**- In the extension, at the top, set the fss (filesystem-server) port to the same port you are running fss with.\
**5**- Choose the protocol (http|https).\
**6**- Enter the right port number. \
**7**- Insert the absolute path or url of the javascript file you want to inject.\
**8**- Decide wether you want to enable HOT RELOAD (this will reload the webpage you are injecting into every time you save changes to your local file!)\
**9**- Turn the switch on. When the switch is on the file will be injected automatically every page load ( with the specified time delay (in milliseconds).\
**10**- If you work at Cloud.IQ, decide wether you want to enable hot reload for JSON config file. (Note: it has to be in the format ' [APP_ID]_plain.json ' and live within the same folder and at the same level as the dev file. You can now work directly on JSON with HOT RELOAD.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

GitHub Repo: [https://github.com/recreateideas/filesystem-server.git](https://github.com/recreateideas/filesystem-server.git)

## Author
Recreate Ideas - Claudio - 2018
## License
[ISC](https://choosealicense.com/licenses/isc/)
