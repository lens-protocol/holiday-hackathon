FROM node:18-alpine AS build_image

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Install Python and build tools
RUN apk add --no-cache bash git python3 py3-pip build-base openssl

# Set Python symlink (node-gyp looks for 'python')
RUN ln -sf /usr/bin/python3 /usr/bin/python

RUN apk --no-cache add curl npm

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# install dependencies
RUN npm install

COPY . ./

RUN ls -ltra .

# generate prisma
RUN npm run db:generate

# build application
RUN npm run build

# remove development dependencies
RUN npm install

FROM node:18-alpine
RUN apk add --no-cache openssl

COPY --from=build_image /usr/src/app/.env /.env
COPY --from=build_image /usr/src/app/dist ./dist
COPY --from=build_image /usr/src/app/.env /dist/.env
COPY --from=build_image /usr/src/app/node_modules ./node_modules
COPY --from=build_image /usr/src/app/prisma ./prisma


CMD ["/bin/sh", "-c", "node dist/main.js"]
