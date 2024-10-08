docker build -t dotnet -f Dockerfile .
# docker tag dotnet 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest
# docker push 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest


docker stop dotnet
docker rm dotnet
cd ../../
docker run -e OPEN_AI_KEY=$OPEN_AI_KEY -d -p 8000:8080 --volume ${pwd}/filesystem:/files --network my-network --name dotnet dotnet 
cd dotnet/ApplicationPlayground