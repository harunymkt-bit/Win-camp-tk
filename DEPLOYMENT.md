# Deployment Guide

## Option 1: Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

### Steps

1. **Create Procfile**
```
web: npm start --prefix backend
```

2. **Deploy**
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku open
```

## Option 2: AWS EC2 Deployment

### Prerequisites
- AWS account
- EC2 instance
- SSH access

### Steps

1. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm
sudo apt install postgresql
```

3. **Clone Repository**
```bash
git clone https://github.com/yourusername/casino-platform.git
cd casino-platform/backend
npm install
```

4. **Set Environment Variables**
```bash
echo 'DATABASE_URL=postgresql://...' >> .env
echo 'JWT_SECRET=your_secret' >> .env
echo 'NODE_ENV=production' >> .env
```

5. **Start Server**
```bash
npm start
```

## Option 3: Docker Deployment

### Create Dockerfile
```dockerfile
FROM node:16
WORKDIR /app
COPY backend/package.json .
RUN npm install
COPY backend/src .
EXPOSE 5000
CMD ["npm", "start"]
```

### Build and Run
```bash
docker build -t casino-platform .
docker run -p 5000:5000 casino-platform
```

## Environment Variables

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/casino_db
JWT_SECRET=your_secret_key_here
STRIPE_API_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_id
```

## SSL/TLS Configuration

Use Let's Encrypt for free SSL:

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

## Monitoring

Recommended tools:
- PM2 for process management
- New Relic for monitoring
- CloudWatch for AWS logging
- ELK Stack for logs

## Database Migration

```bash
npm run migrate
```
