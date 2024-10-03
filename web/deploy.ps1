# docker build -t react -f Dockerfile .


docker build -t react .
docker tag react 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest
docker push 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest

# docker stop react
# docker rm react

# For the cluster 
# docker run -d -p 80:80 --network my-network --name react react
# For the local 
# docker run -d -p 8080:80 --network my-network --name react react
