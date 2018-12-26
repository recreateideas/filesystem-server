echo 'Detected OS: ' $OSTYPE;
        sudo npm install --cache /tmp/empty-cache forever && sudo rm -r /tmp/empty-cache;

# if [[ "$OSTYPE" == "linux-gnu" ]]; then
        # echo 'Setting up local dependencies...';
        # sudo npm install --cache /tmp/empty-cache forever && sudo rm -r /tmp/empty-cache;
# elif [[ "$OSTYPE" == "darwin"* ]]; then
#         echo 'Setting up local dependencies...';

# elif [[ "$OSTYPE" == "cygwin" ]]; then
        # POSIX compatibility layer and Linux environment emulation for Windows
# elif [[ "$OSTYPE" == "msys" ]]; then
        # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
# elif [[ "$OSTYPE" == "win32" ]]; then
        # I'm not sure this can happen.
# elif [[ "$OSTYPE" == "freebsd"* ]]; then
        # ...
# else
        # Unknown.
# fi
