set RANDFILE=.rnd;

if [[ "$OSTYPE" == "cygwin" ]]; then
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout security/cert.key -out security/cert.pem -config security/req.cnf -sha256;
runas /user:$whoami\administrator chmod 755 security/cert.pem && runas /user:$whoami\administrator chmod 755 security/cert.key;
elif [[ "$OSTYPE" == "darwin"* ]]; then
printf "Your password is needed to install SSL certificates\n";
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout security/cert.key -out security/cert.pem -config security/req.cnf -sha256;
sudo chmod 755 security/cert.pem && sudo chmod 755 security/cert.key;
elif [[ "$OSTYPE" == "linux-gnu" ]]; then
printf "Your password is needed to install SSL certificates\n";
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout security/cert.key -out security/cert.pem -config security/req.cnf -sha256;
sudo chmod 755 security/cert.pem && sudo chmod 755 security/cert.key;

fi

if [[ -f security/cert.pem && -f security/cert.key ]]; then printf "
 ###########################################################################
##                                                                         ##
##                            !!  READ UP  !!                              ##
##                                                                         ##
##  We have installed SSL key and certificate to use with https protocol.  ##
##                      These are valid for 10 years.                      ##
##    To generate new ones run the 'postinstall' script in package.json.   ##
##                Don't forget to add them to your browser.                ##
##                                                                         ##
 ###########################################################################\n\n
";
else "
 ###########################################################################
##                                                                         ##
##                             !!  ERROR !!                                ##
##                                                                         ##
##   Something went wrong while installing your key and certificate  :-(   ##
##                                                                         ##
 ###########################################################################\n\n";
 fi
