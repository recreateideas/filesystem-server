#!/bin/bash

cd $(dirname $0)

mkdir -p /Library/Google/Chrome/NativeMessagingHosts
cp com.recreate.filesystem-server.json /Library/Google/Chrome/NativeMessagingHosts
