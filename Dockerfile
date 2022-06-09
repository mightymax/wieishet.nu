FROM node

ARG FUSEKI_VERSION=4.5.0
ARG DLCDN=https://dlcdn.apache.org/jena/binaries

WORKDIR /app
COPY src ./src 
COPY ["*.json", "entrypoint.sh", "nginx.conf", "./" ]

RUN \
  npm install && \
  ./node_modules/.bin/ng build && \
  apt update && apt install -y nginx default-jre-headless && \
  cp nginx.conf /etc/nginx/sites-enabled/default && \
  curl -s ${DLCDN}/apache-jena-fuseki-${FUSEKI_VERSION}.tar.gz | tar zx 

EXPOSE 8080 

ENV \
  FUSEKI_HOME=/app/apache-jena-fuseki-${FUSEKI_VERSION} \
  FUSEKI_DIR=/app/apache-jena-fuseki-${FUSEKI_VERSION} \
  FUSEKI_JAR=fuseki-server.jar \
  JAVA_OPTIONS="-Xmx512M -Xms512M"  


ENTRYPOINT ["/app/entrypoint.sh" ]
