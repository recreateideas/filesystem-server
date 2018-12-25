printf "Your password is needed to install SSL certificates\n";
set RANDFILE=.rnd;

sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout cert.key -out ./cert.pem -config ./req.cnf -sha256;

printf "
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
