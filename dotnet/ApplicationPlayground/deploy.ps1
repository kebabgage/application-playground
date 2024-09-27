docker build -t dotnet -f Dockerfile .
docker stop dotnet
docker rm dotnet
docker run -d -p 8000:8080 --network my-network --name dotnet dotnet 