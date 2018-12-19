[![Build Status](https://travis-ci.org/projecttacoma/cqm-execution-service.svg?branch=master)](https://travis-ci.org/projecttacoma/cqm-execution-service)
[![codecov](https://codecov.io/gh/projecttacoma/cqm-execution-service/branch/master/graph/badge.svg)](https://codecov.io/gh/projecttacoma/cqm-execution-service)

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
yarn docker-build
```

4. Run the Docker image.
```
yarn docker-run
```

5. Stop the running Docker image.
```
yarn docker-stop
```

## Testing

1. Run the unit tests.
```
yarn test
```

2. Run the tests against a live server.
```
yarn docker-run
yarn testRunningServer
yarn docker-clean
```
