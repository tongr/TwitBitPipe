@ECHO OFF
SETLOCAL

ECHO ========================================
ECHO Insalling missing node modules ...
ECHO ========================================
CALL npm install amqp
ECHO ----------------------------------------
CALL npm install ntwitter

ECHO ========================================
ECHO Configuring ...
ECHO ========================================
XCOPY /Q /-Y  twitter.credentials.example.js twitter.credentials.private.js
ECHO Please configure Twitter streaming API access (twitter.credentials.private.js)
:PROMPT1
SET /P EDITNOW=Edit twitter.credentials.private.js now (Y/[N])?
IF /I "%EDITNOW%" NEQ "Y" GOTO PROMPT2
CALL notepad twitter.credentials.private.js

SET EDITNOW=N
ECHO ----------------------------------------
XCOPY /Q /-Y rabbitmq.config.example.js rabbitmq.config.private.js
ECHO Please configure RabbitMQ server settings (rabbitmq.config.private.js)
:PROMPT2
SET /P EDITNOW=Edit rabbitmq.config.private.js now (Y/[N])?
IF /I "%EDITNOW%" NEQ "Y" GOTO END
CALL notepad rabbitmq.config.private.js

:END
ECHO ========================================
ECHO Installation finished!
ECHO ========================================

ENDLOCAL