# LambdaTest Playwright Automation (via Docker)

This repo demonstrates end-to-end Playwright automation on LambdaTest using Docker, without installing browsers locally.

## 🐳 Run with Docker

### 1. Clone the Repo
```sh
git clone https://github.com/<your-username>/playwright-lambdatest.git
cd playwright-lambdatest
```

### 2. Create a .env file
```sh
LT_USERNAME=your_username
LT_ACCESS_KEY=your_access_key
```

### 3. Build the Docker Image
```sh
docker build -t lt-playwright .
```
### Run the Tests in Docker
```sh
docker run --env-file .env lt-playwright
```

Tests
Test Case 1:
Navigate to Amazon.com
Search for any iPhone
Add the selected iPhone to the cart
Retrieve and print the price of the device

Test Case 2:
Navigate to Amazon.com
Search for any Galaxy device
Add the selected Galaxy device to the cart
Retrieve and print the price of the device
