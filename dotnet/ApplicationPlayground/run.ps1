docker build -t playground-dotnet -f Dockerfile .
docker stop playground-dotnet
docker rm playground-dotnet
docker run -d -p 8000:8080 --network my-network --name playground-dotnet playground-dotnet 