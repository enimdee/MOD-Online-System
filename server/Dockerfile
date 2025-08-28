FROM node:20-alpine

WORKDIR /app

# ติดตั้ง dependencies
COPY package.json ./
RUN npm ci --omit=dev

# คัดลอกซอร์ส
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
