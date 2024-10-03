sudo docker pull 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest
sudo docker stop react
sudo docker rm react
sudo docker run -d -p 80:80 --network my-network --name react 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest