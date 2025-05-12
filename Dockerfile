FROM mcr.microsoft.com/playwright:v1.43.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose environment variables for LambdaTest config (if needed)
ENV HOME=/root

CMD ["npm", "run", "test:lt"]
