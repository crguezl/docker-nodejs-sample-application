## Referencias

* [Docker Docs: Sample application](https://docs.docker.com/get-started/02_our_app/)
* [Repo docker/getting-started](https://github.com/docker/getting-started)
* The [folder](https://github.com/docker/getting-started/tree/master/app) with this app
* [My notes about Docker in the PL book](https://ull-esit-gradoii-pl.github.io/assets/temas/introduccion-a-javascript/docker.html#sample-application)

## Build 

```
docker build -t getting-started .
```

## Run 

```
docker run -dp 3000:3000 getting-started
```