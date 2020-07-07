# Micro CI - API Webhook

## I. Pré-requis

### A. Variables d'environnement

Settez les variables d'environnement dans votre terminal :

`set BROKER_IP=127.0.0.1:5672` - IP et PORT du Broker

`set BROKER_USERNAME=root` - Username du user du Broker

`set BROKER_PASSWORD=root` - Password du user du Broker

`set CONSUL_HOST=127.0.0.1` - IP de Consul

`set CONSUL_PORT=8500` - PORT de Consul

`set CONSUL_TOKEN=azertyuiop` - TOKEN de Consul


## II. Lancement de l'API via avec npm

### 1. Installer les Dépendances

Installer les dépendances avec :

`npm install`

### 2. Lancement

Lancer en mode "Dév":

```
npm run dev
```

Lancer en mode "Prod":

```
node index.js
```

## III. Lancement de l'API avec Docker ou Docker-compose

Lancer avec Docker:

```
docker build . -t "micro-ci"
docker run -e BROKER_IP -p 3000:3000 --name="micro-ci" micro-ci
```

Lancer avec Docker-compose:

```
docker-compose up -d
```

Stopper avec Docker-compose:

```
docker-compose down
```

## IV. Collaborateurs

- Pauline ROUVEL
- Gautier LAURENT
- Alexandre CHAMPAUD
- Grégory BRUGNET
