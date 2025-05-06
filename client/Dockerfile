# Step 1: Bygg React-appen
FROM node:20 AS build

WORKDIR /app
COPY . .
COPY .env .env

RUN npm install
RUN npm run build

# # Step 2: Servera med Nginx
# FROM nginx:stable-alpine AS production

# COPY --from=build /app/build /usr/share/nginx/html
# COPY default.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]