FROM node

ARG FUSEKI_VERSION=4.5.0
ARG DLCDN=https://dlcdn.apache.org/jena/binaries

WORKDIR /app
COPY src ./src 
COPY ["*.json", "entrypoint.sh", "./" ]

RUN \
  npm install -g http-server && \
  npm install && \
  ./node_modules/.bin/ng build && \
  curl -s ${DLCDN}/apache-jena-${FUSEKI_VERSION}.tar.gz | tar zx 

EXPOSE 8080 
EXPOSE 3030

ENV \
  JENA_HOME=/app/apache-jena-${FUSEKI_VERSION} \
  FUSEKI_HOME=/appt/apache-jena-fuseki-${FUSEKI_VERSION} \
  FUSEKI_DIR=/app/apache-jena-fuseki-${FUSEKI_VERSION} \
  FUSEKI_JAR=fuseki-server.jar \
  JAVA_OPTIONS="-Xmx512M -Xms512M"  


ENTRYPOINT ["./entrypoint.sh" ]
CMD []
