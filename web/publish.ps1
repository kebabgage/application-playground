# Log in if we haven't already
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com

# Pubbo the image 
docker build -t react .
docker tag react 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest
docker push 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com/recipes:latest
