# 1. Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# 2. Instaliraj samo production zavisnosti
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 3. Kopiraj samo kod i build-uj
COPY . .
RUN yarn build

# 4. Production stage - koristi lakšu sliku
FROM node:20-alpine
WORKDIR /app

# 5. Kopiraj samo neophodne fajlove iz build faze
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["yarn", "start:prod"]
