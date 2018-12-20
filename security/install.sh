openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256;
printf "
#############################################################################
##                                                                         ##
##                           !!  ATTENTION  !!                             ##
##                                                                         ##
##  We have installed SSL key and certificate to use with https protocol.  ##
##                      These are valid for 10 years.                      ##
##    To generate new ones run the 'postinstall' script in package.json.   ##
##                                                                         ##
#############################################################################\n\n
"
