FROM node:16.18.0-alpine
WORKDIR /app
COPY . .
RUN npm install

# RUN
ENTRYPOINT ["npm", "run", "dev"]