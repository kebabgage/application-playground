sudo docker pull 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest
sudo docker stop dotnet
sudo docker rm dotnet
sudo docker run -d -p 8000:8080 --volume ./filesystem:/files --network my-network --name dotnet 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest
