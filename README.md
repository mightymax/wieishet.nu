# Wie is Het?

Linked Data versie van het bekende "Wie is Het?" spel.

## Docker installatie
```
docker buildx build -t wieishet .
docker run -d -p 8080:8080  --rm wieishet
```
Ga naar http://localhost:8080 om de app te bekijken.

## Lokale software ontwikkeling

We gebruiken hier het pad `/opt/wieishet.nu` als voorbeeld, uiteraard kun je je eigen pad gebruiken.

### Angular project:
```
npm install -g @angular/cli
cd /opt/wieishet.nu
mkdir app
git clone https://github.com/mightymax/wieishet.nu.git ./app
cd ./app
npm install
ng serve --open
```

### Start Fuseki
```
cd /opt/wieishet.nu
wget https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-4.5.0.tar.gz | tar zxv
cd apache-jena-fuseki-4.5.0
./fuseki-server ../../app/src/ontologie/wieishet.ttl /wieishet
```

