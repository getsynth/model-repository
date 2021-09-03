FROM mongo:latest

###### Install Binary Deps ######

RUN apt-get update && apt-get install -qy curl

###### Install Node ######

ENV NODE_VERSION=16.1.0
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version


###### Install Synth ######

RUN curl --proto '=https' --tlsv1.2 -sSL https://sh.getsynth.com | sh -s -- --ci

###### Copy Files ######

RUN mkdir /opt/app
COPY prisma/ /opt/app/prisma/
COPY shopify/ /opt/app/shopify/
COPY src/ /opt/app/src/
COPY package.json /opt/app
COPY tsconfig.json /opt/app
COPY start.sh /opt/app/start.sh
COPY package-lock.json /opt/app/package-lock.json


###### Installing Server ######

WORKDIR /opt/app
RUN npm install

###### Install and Run Server ######
EXPOSE 3000
ENTRYPOINT ["/opt/app/start.sh"]

