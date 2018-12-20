openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256;
printf "Installed SSL key and certificate. They are valid for 10 years.\n"
