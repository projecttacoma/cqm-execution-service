FROM node:9-slim

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn config set "strict-ssl" false
#this is needed due to mitre proxy, not ideal in prod

RUN yarn install --only=production
# If you are building your code for production
# RUN yarn install --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]