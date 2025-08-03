# 💳 Digital Wallet API

A secure, modular, and role-based RESTful API for managing a digital wallet system. Inspired by platforms like **bKash** and **Nagad**, this backend allows users, agents, and admins to perform essential wallet and financial operations, powered by **Express.js** and **Mongoose**.

---

## 📚 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Usage](#-usage)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)
- [Dependencies](#-dependencies)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 Project Overview

This project implements a **role-based digital wallet management system** with:

- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Auto wallet creation upon registration
- ✅ Money transfer, add, withdraw
- ✅ Wallet and transaction history management
- ✅ Secure password handling
- ✅ Modular service-layer-based architecture

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint                | Description     |
|--------|-------------------------|-----------------|
| POST   | `/api/v1/auth/login`    | User login      |
| POST   | `/api/v1/auth/logout`   | User logout     |

### 👤 User

| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| GET    | `/api/v1/user`       | Get all users (admin) |
| PATCH  | `/api/v1/user/:id`   | Update user (admin)   |

### 💼 Wallet

| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| GET    | `/api/v1/wallet/me`     | View own wallet info |

### 💸 Transactions

| Method | Endpoint                                 | Description                   |
|--------|------------------------------------------|-------------------------------|
| POST   | `/api/v1/transaction/add-money`          | Add money                     |
| POST   | `/api/v1/transaction/send-money`         | Send money to another user    |
| POST   | `/api/v1/transaction/withdraw-money`     | Withdraw using agent          |
| GET    | `/api/v1/transaction/history`            | View transaction history      |
| POST   | `/api/v1/transaction/cash-in`            | Agent: Add money to user      |
| POST   | `/api/v1/transaction/cash-out`           | Agent: Withdraw from user     |


## ✨ Features

- **Authentication & Authorization**
  - JWT login with roles: `Admin`, `User`, `Agent`
  - Password hashing via `bcrypt`
- **Users**
  - Add, send, withdraw money
  - View transaction history
- **Agents**
  - Perform cash-in/out on users
  - Track commissions (optional)
- **Admins**
  - Manage users, agents, wallets, and transactions
  - Block/unblock wallets
  - Approve/suspend agents
- **Transactions**
  - All financial operations are persistently stored and trackable
- **Security**
  - Role-based route protection
  - Input validation
- **System Parameters** *(optional)*
  - Admin-settable transaction fees, commission rates, etc.

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/safin33221/Digital-Wallet-Management-System-Backend.git

cd Digital-Wallet-Management-System-Backend

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Start server (dev mode)
npm run dev


