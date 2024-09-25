docker rm playground-dotnet
docker build -t playground-dotnet -f Dockerfile .
docker run -d -p 8000:8080 --network my-network --name playground-dotnet playground-dotnet 