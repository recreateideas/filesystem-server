@echo off
set RANDFILE=.rnd

set OPENSSL_CONF=%cd%\security\req.cnf

C:\OpenSSL-Win64\bin\openssl.exe req -x509 -nodes -days 3650 -newkey -sha256 rsa:2048 -keyout security\cert.key -out security\cert.pem

if exist security/cert.pem if exist security/cert.key (
echo.
echo  ###########################################################################
echo ##                                                                         ##
echo ##                            !!  READ UP  !!                              ##
echo ##                                                                         ##
echo ##  We have installed SSL key and certificate to use with https protocol.  ##
echo ##                      These are valid for 10 years.                      ##
echo ##    To generate new ones run the 'postinstall' script in package.json.   ##
echo ##                Don't forget to add them to your browser.                ##
echo ##                                                                         ##
echo  ###########################################################################
echo.
) else (
echo.
echo  ###########################################################################
echo ##                                                                         ##
echo ##                             !!  ERROR !!                                ##
echo ##                                                                         ##
echo ##   Something went wrong while installing your key and certificate  :-(   ##
echo ##                                                                         ##
echo  ###########################################################################
)
