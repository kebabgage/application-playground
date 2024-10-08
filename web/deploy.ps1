docker build -t react -f Dockerfile .

docker stop react
docker rm react

# For the local 
docker run -d -p 8080:80 --network my-network --name react react
