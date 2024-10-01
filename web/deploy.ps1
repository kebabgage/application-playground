# docker build -t react -f Dockerfile .


docker build -t react .

docker stop react
docker rm react
# For the cluster 
docker run -d -p 80:80 --network my-network --name react react
# For the local 
# docker run -d -p 8080:80 --network my-network --name react react
