FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Takes variables from docker-compose fil
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_REACT_APP_API_URL

#Sets argument variables to environment variables
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_REACT_APP_API_URL=$VITE_REACT_APP_API_URL

COPY . .
COPY .env .env
RUN npm run build

# # Step 2: Servera med Nginx
FROM nginx:stable-alpine AS production

COPY --from=build /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]