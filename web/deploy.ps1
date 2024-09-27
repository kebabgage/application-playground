# docker build -t playground-react -f Dockerfile .

# docker run -d -p 5000:3000 --network my-network --name playground-react playground-react 

docker build -t playground-react .

docker stop playground-react
docker rm playground-react
docker run -d -p 8080:80 --network my-network --name playground-react playground-react
