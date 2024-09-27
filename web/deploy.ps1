# docker build -t react -f Dockerfile .

# docker run -d -p 5000:3000 --network my-network --name react react 

docker build -t react .

docker stop react
docker rm react
docker run -d -p 8080:80 --network my-network --name react react
