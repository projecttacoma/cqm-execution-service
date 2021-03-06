[![Build Status](https://travis-ci.com/projecttacoma/cqm-execution-service.svg?branch=master)](https://travis-ci.com/projecttacoma/cqm-execution-service)
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

## Versioning

Starting with version **2.0.0** released on 7/18/2019, cqm-execution-service versioning has the format **X.Y.Z**, where:

* **X** maps to a version of CQL. See the table below to see the existing mapping to CQL versions.

  | X | CQL version |
  | --- | --- |
  | 2 | 1.3 |

* **Y** indicates major changes (incompatible API changes)

* **Z** indicates minor changes (added functionality in a backwards-compatible manner) and patch changes (backwards-compatible bug fixes)

For the versions available, see [tags on this repository](https://github.com/projecttacoma/cqm-execution-service/tags).


## License

Copyright 2018 The MITRE Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

```
http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
