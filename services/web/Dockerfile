FROM node:20-slim

# Tell Express and npm this is a production environment
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies first, so this layer is cached between code changes.
# npm ci installs exactly what package-lock.json lists.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Then copy the app code, templates, and static files
COPY app.js ./
COPY db ./db
COPY views ./views
COPY public ./public

# The official Node image includes a non-root "node" user
USER node

EXPOSE 57891

CMD ["node", "app.js"]
