# docker build -t playground-react -f Dockerfile .
# docker stop playground-react
# docker rm playground-react
# docker run -d -p 5000:3000 --network my-network --name playground-react playground-react 

docker build -t my-react-app .
docker run -p 8080:80 --name my-react-app-container my-react-app
