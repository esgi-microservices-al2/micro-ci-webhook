# Micro CI - API Webhook

## I. Pré-requis

### A. Variables d'environnement

Settez les variables d'environnement dans votre terminal :

`set BROKER_URL=127.0.0.1` - IP du Broker


## II. Lancement de l'API via avec npm

### 1. Installer les Dépendances

Installer les dépendances avec :

`npm install`

### 2. Lancement

Lancer en mode "Dév":

```
npm run dev
```

## III. Lancement de l'API avec Docker ou Docker-compose

Lancer avec Docker:

```
docker build . -t "micro-ci"
docker run -e BROKER_URL -p 3000:3000 --name="micro-ci" micro-ci
```

Lancer avec Docker-compose:

```
docker-compose up -d
```

## IV. Collaborateurs

- Pauline ROUVEL
- Gautier LAURENT
- Alexandre CHAMPAUD
- Grégory BRUGNET
