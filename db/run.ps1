docker rm db
docker run --network my-network --name db -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=root -p 5432:5432 -d postgres