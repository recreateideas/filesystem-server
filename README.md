[![NPM](https://nodei.co/npm/filesystem-server.png)](https://nodei.co/npm/filesystem-server/)

![](https://img.shields.io/badge/built%20for-chrome%20extensions-blue.svg)
![](https://img.shields.io/badge/downloads-2k%2Fm-orange.svg)

# filesystem-server

Node app to serve the filesystem over Localhost via API call.

## Installation

**1-** Use npm to install filesystem-server globally

>Note: for windows you will need to install [cygwin](https://www.cygwin.com/) to be able to use this package

```bash
npm install -g filesystem-server #add "--unsafe" flag if executing it as 'nobody' user in linux
```
So that you can connect via https the installation script will install a SSL key and certificate that are valid for 10 years.\
**These files are created through a postinstall script, this is why on the latest linux distributions you need to run the install with --unsafe.**\
> *-Don't forget to [add your certificates to your browser](https://support.securly.com/hc/en-us/articles/206081828-How-to-manually-install-the-Securly-SSL-certificate-in-Chrome) if serving files via https on a browser-*

**2-** Paste this in your Chrome address bar:
```
chrome://flags/#allow-insecure-localhost
```
You should see highlighted text saying:\
`Allow invalid certificates for resources loaded from localhost`

**3-**Click `Enable`

>-this is in case there were hiccups in the creation of your certificate-

## Usage - Terminal
in your terminal run:
```bash
filesystem-server [port] [https port] #?optional default 2222 4444
```
## Usage - Fetch / Axios
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

**3-** Know your endpoints

```
    app.get('/exists/:filePath', doesFIleExist);

    app.get('/files/:filePath', handleFilePath);

    app.post('/hotReload/', enableHotReload);

    app.get('/testFSSConnection',(req,res) => {
        console.log(`@@@ :: ${new Date()} -> connected`);
        res.json({fssConnected:"true"});
    });
```
>-for full code visit the [GitHub Repo](https://github.com/recreateideas/filesystem-server.git)

## Usage - Injector [Chrome Extension]

**1**- Install and launch Injector.\
**2**- Run `filesystem-server`\
**3**- Import your new SSL certificate (that you will find inside the node_modules/filesystem-server/security folder in your system library ) to Chrome (follow this guide https://support.securly.com/hc/en-us/articles/206081828-How-to-manually-install-the-Securly-SSL-certificate-in-Chrome ) or paste `chrome://flags/#allow-insecure-localhost` in Chrome address bar.\
**4**- In the extension, at the top, set the fss (filesystem-server) port to the same port you are running fss with.\
**5**- Choose the protocol (http|https).\
**6**- Insert the absolute path or url of the javascript file you want to inject.\
**7**- Decide wether you want to enable HOT RELOAD (this will reload the webpage you are injecting into every time you save changes to your local file!)\
**8**- Turn the switch on. When the switch is on the file will be injected automatically every page load ( with the specified time delay (in milliseconds).\
**9**- If you work at cloud.IQ, decide wether you want to enable hot reload for JSON config file. (Note: it has to be in the format ' [APP_ID]_plain.json ' and live within the same folder and at the same level as the dev file. You can now work directly on JSON with HOT RELOAD.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

GitHub Repo: [https://github.com/recreateideas/filesystem-server.git](https://github.com/recreateideas/filesystem-server.git)

## Author
Recreate Ideas - Claudio - 2018
## License
[ISC](https://choosealicense.com/licenses/isc/)
