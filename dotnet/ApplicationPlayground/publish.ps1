docker build -t dotnet -f Dockerfile .
docker tag dotnet 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest
docker push 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes/dotnet:latest
