FROM node:16.18.0-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# RUN
ENTRYPOINT ["npm", "run", "start"]