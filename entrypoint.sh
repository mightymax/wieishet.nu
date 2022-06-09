#!/bin/sh
nginx
exec "java" $JAVA_OPTIONS -jar "${FUSEKI_DIR}/${FUSEKI_JAR}" --file=/app/src/ontologie/wieishet.ttl /wieishet
