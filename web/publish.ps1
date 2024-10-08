
docker build -t react .
docker tag react 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest
docker push 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest
