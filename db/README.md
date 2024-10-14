## Deploying postgres to docker

```
docker run --name <container_name> -e POSTGRES_PASSWORD=<password> -e POSTGRES_USER=<root> -p 5432:5432 -d postgres
```

## Adding a volume for dotnet to consume

```sh
docker volume create recipe-files
```

## Creating a dump of the database

```sh
docker exec db pg_dump -U root ApplicationPlayground > db.backup
```

## Restoring the DB

```
cat db.backup | docker exec -i db psql -U root ApplicationPlayground
```
