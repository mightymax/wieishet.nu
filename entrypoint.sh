#!/bin/sh
exec "java" $JAVA_OPTIONS -jar "${FUSEKI_DIR}/${FUSEKI_JAR}" --file=/app/src/ontologie/wieishet.ttl 1>/dev/null 2>/dev/null &
cd dist/wieishet
http-server --port 8080 --proxy http://localhost:8080?
