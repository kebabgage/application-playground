# Create network

```sh
docker network create my-network
```

# Installing docker on Linx

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
```

# Log back in to AWS

````sh
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 443370684269.dkr.ecr.ap-southeast-2.amazonaws.com
```

````
