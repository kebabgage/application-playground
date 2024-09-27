# docker build -t playground-react -f Dockerfile .
# docker stop playground-react
# docker rm playground-react
# docker run -d -p 5000:3000 --network my-network --name playground-react playground-react 

docker build -t playground-react .
docker run -p 80:80 --name playground-react playground-react
