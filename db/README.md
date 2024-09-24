## Deploying postgres to docker

```
docker run --name <container_name> -e POSTGRES_PASSWORD=<password> -e POSTGRES_USER=<root> -p 5432:5432 -d postgres
```
