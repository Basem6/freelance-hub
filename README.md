# Freelance Hub

A modern freelance marketplace platform that connects **clients** with **freelancers**, allowing clients to publish projects and freelancers to discover and work on suitable opportunities.

> 🚧 **Project Status:** Under Active Development

The platform is currently being developed, and several features are still being implemented and improved.

## ✨ Features

### 👤 Authentication & Users

* User registration and login
* Google OAuth authentication
* Role-based accounts:

  * Freelancer
  * Client
* Protected routes using JWT
* User profile management
* Profile image upload

### 💼 Projects

* Clients can create and manage projects
* Freelancers can browse available projects
* Public project details
* Project categorization
* Project budget and description
* Project status management

### 💬 Real-Time Communication

* Real-time messaging using Socket.IO
* Notifications
* Message notifications
* Notification sounds

### 🔐 Authorization

* Role-based access control
* Protected pages
* Freelancer-only pages
* Client-only pages
* JWT authentication with HTTP-only cookies

## 🚧 Upcoming Features

The project is still under development. Planned features include:

### 📄 Proposals

* Freelancers can submit proposals for projects
* Proposal description
* Proposed budget
* Delivery time
* Client proposal management
* Accept / reject proposals

### 💳 Payment System

* Payment gateway integration
* Secure freelancer payments
* Client payments
* Payment status tracking
* Transaction history
* Future support for escrow-style payments

### ⭐ Reviews & Ratings

* Clients can rate freelancers
* Freelancers can rate clients
* Reviews after completing projects
* Freelancer rating system

### 🔔 Advanced Notifications

* Real-time project notifications
* Proposal notifications
* Payment notifications
* Message notifications

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Redux
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication

### Services

* Google OAuth
* Cloudinary
* Payment Gateway *(Coming Soon)*

## 📁 Project Structure

```text
Freelance-Hub/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── redux/
│   └── ...
└── README.md
```

## 🔑 User Roles

### Freelancer

Freelancers can:

* Browse available projects
* View project details
* Submit proposals
* Communicate with clients
* Manage their profile
* Track earnings

### Client

Clients can:

* Create projects
* Manage projects
* Review freelancer proposals
* Communicate with freelancers
* Hire freelancers
* Manage payments

## 🔮 Roadmap

* [x] Authentication
* [x] Google OAuth
* [x] Role-based authorization
* [x] Freelancer profiles
* [x] Client profiles
* [x] Project creation
* [x] Project browsing
* [x] Real-time messaging
* [x] Notifications
* [ ] Proposals
* [ ] Proposal management
* [ ] Hiring workflow
* [ ] Payment gateways
* [ ] Transactions
* [ ] Reviews & ratings
* [ ] Advanced notifications

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd Freelance-Hub
```

### 2. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

### 3. Environment Variables

Create `.env` files for both frontend and backend and add the required environment variables.

Example:

```env
MONGODB_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 4. Run the project

Frontend:

```bash
npm run dev
```

## 📌 Project Status

Freelance Hub is currently an **active development project**.

The core marketplace functionality is being implemented, while major features such as **Proposals, Hiring Workflow, and Payment Gateways** are planned for upcoming versions.

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

## 📄 License

This project is currently developed for educational and portfolio purposes.
