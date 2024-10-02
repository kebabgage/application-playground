docker build -t dotnet -f Dockerfile .
docker stop dotnet
docker rm dotnet
cd ../../
docker run -d -p 8000:8080 --volume ${pwd}/filesystem:/files --network my-network --name dotnet dotnet 
cd dotnet/ApplicationPlayground