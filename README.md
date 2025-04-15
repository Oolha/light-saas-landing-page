# Progressy.io

A modern, responsive SaaS landing page built with Next.js and Express backend. This full-stack application showcases a productivity tracking app with pricing plans, testimonials, and user authentication functionality.

https://progressyio.vercel.app/

## 🚀 Features

- **Responsive Design**: Fully responsive UI that works on all devices
- **Modern UI**: Built with TailwindCSS and Framer Motion for smooth animations
- **User Authentication**: Secure login and registration system
- **Form Validation**: Client-side validation using React Hook Form and Zod
- **Backend API**: RESTful API with Express and MongoDB
- **File Upload**: Support for image uploads with Cloudinary integration
- **JWT Authentication**: Secure authentication with JSON Web Tokens

## 🛠️ Tech Stack

### Frontend

- [Next.js 15](https://nextjs.org/) - React framework for production
- [React 19](https://react.dev/) - JavaScript library for building user interfaces
- [TailwindCSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React
- [React Hook Form](https://react-hook-form.com/) - Form validation library
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Headless UI](https://headlessui.com/) - Unstyled, accessible UI components
- [TypeScript](https://www.typescriptlang.org/) - Static type checking

### Backend

- [Express](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) - Database and ODM
- [JWT](https://jwt.io/) - Authentication with JSON Web Tokens
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [Cloudinary](https://cloudinary.com/) - Cloud-based image management
- [Multer](https://github.com/expressjs/multer) - Middleware for handling multipart/form-data

## 💳 Stripe Integration

This project includes a complete subscription payment system powered by Stripe, offering:

- **Subscription Plans**: Multiple subscription tiers with different pricing and features
- **Secure Checkout**: Integrated Stripe Checkout for secure payment processing
- **Subscription Management**: Customer portal for managing existing subscriptions
- **Webhook Integration**: Real-time subscription status updates via Stripe webhooks
- **Error Handling**: Comprehensive error handling for payment failures

### Stripe Features

- One-time payments and recurring subscriptions
- Secure payment processing with Stripe Checkout
- Customer portal for managing subscriptions
- Automatic invoicing and receipt generation
- Real-time webhook integration for subscription updates

## 📋 Prerequisites

- Node.js 20.x or later
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (for image uploads)

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/Oolha/light-saas-landing-page.git
cd light-saas-landing-page
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)

# Run development server
npm run dev

# Seed database with initial data (optional)
npm run seed

# Start production server
npm start
```

## 🔐 Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Backend (.env)

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/light-saas
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=
```

## 👤 Author

Olha Sydorchuk
