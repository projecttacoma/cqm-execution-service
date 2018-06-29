[![Build Status](https://travis-ci.org/projecttacoma/cqm-execution-service.svg?branch=master)](https://travis-ci.org/projecttacoma/cqm-execution-service)

# cqm-execution-service

A Dockerized node based service for calculating clinical quality measures.

## Building and Running

1. Clone this repository to the machine you wish to run the service on.
```
git clone https://github.com/projecttacoma/cqm-execution-service.git
```

2. Navigate into the project directory.
```
cd cqm-execution-service/
```

3. Build the project as a Docker image.
```
docker build -t docker/cqm-execution-service .
```

4. Run the Docker image.
```
docker run -p 8081:8081 -d docker/cqm-execution-service
```
