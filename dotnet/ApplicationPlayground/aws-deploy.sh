sudo docker pull 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest
sudo docker stop dotnet
sudo docker rm dotnet
cd ../../..
sudo docker run -d -e OPEN_AI_KEY=$OPEN_AI_KEY -p 8000:8080 --volume ./filesystem:/files --network my-network --name dotnet 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest
cd ./application-playground/dotnet/ApplicationPlayground