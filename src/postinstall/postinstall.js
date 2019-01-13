const child_process = require('child_process');
const { normalizeWinPath } = require('../utils/filesUtils');

const installSSLKeys = async () => {
    var isWin = process.platform === "win32";
    let path, shell, dirname;
    const unixPath = '/../../security/install.sh';
    const unixShell = 'bash';
    const winPath = '\\..\\..\\security\\install.bat';
    const winShell = 'powershell.exe';
    const options = {
                cwd: process.cwd(),
                detached: false,
                stdio: 'inherit',
            };
    if(isWin){
        path = winPath;
        shell = winShell;
        dirname = normalizeWinPath(__dirname);
    } else {
        path = unixPath;
        shell = unixShell;
        dirname = __dirname;
    }

    child_process.spawn(shell, [dirname + path], options,);
};

installSSLKeys();
