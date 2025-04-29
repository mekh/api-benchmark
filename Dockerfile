FROM node:22.14-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force
COPY . .

RUN npm run build

FROM node:22.14-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
RUN apk add --no-cache gcompat mc nano iputils-ping net-tools

CMD ["npm", "run", "start:prod"]
