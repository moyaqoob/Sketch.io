
FROM node:18-alpine

WORKDIR /usr/src/app

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_WS_URL
ARG DATABASE_URL

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV DATABASE_URL=${DATABASE_URL}


COPY ./packages ./packages
COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json
COPY ./apps/excalidraw-frontend ./apps/cosketch-frontend


RUN npm install
RUN npm build

EXPOSE 3000

CMD ["npm", "run", "start:frontend"]