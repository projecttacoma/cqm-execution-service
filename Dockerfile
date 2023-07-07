FROM node:16-slim

# Install app dependencies, including ssl_setup if it exists
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json docker_ssl_setup.sh* ./

# Run a custom ssl_setup script if available
RUN ./docker_ssl_setup.sh; exit 0

RUN apt-get update && apt-get install -y git-core

# Bundle app source
COPY . /usr/src/app

WORKDIR /usr/src/app

RUN yarn install --only=production


EXPOSE 8081

CMD [ "yarn", "start" ]
