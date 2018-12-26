echo 'installing forever dependendency for '$OSTYPE'...';

if [[ "$OSTYPE" == "cygwin" ]]; then
npm install -g forever;
elif [[ "$OSTYPE" == "darwin"* ]]; then
npm install -g --cache /tmp/empty-cache forever && sudo rm -r /tmp/empty-cache;
elif [[ "$OSTYPE" == "linux-gnu" ]]; then
sudo npm install -g --cache /tmp/empty-cache forever && sudo rm -r /tmp/empty-cache;
fi
