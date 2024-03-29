FROM node as builder

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:16.12-alpine

ENV NODE_ENV production
USER node

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist
# generated prisma files
COPY prisma ./prisma/

RUN npx prisma generate

EXPOSE 3000
CMD [ "node", "dist/src/index.js" ]