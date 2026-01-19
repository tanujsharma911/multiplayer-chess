# Build stage

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_SERVER_URL
ARG VITE_AUTH_URL
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# Production stage

FROM node:22-alpine

WORKDIR /app

RUN npm i -g serve

ENV PATH="/usr/local/bin:$PATH"

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
