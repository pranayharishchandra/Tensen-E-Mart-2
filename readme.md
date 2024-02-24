# Tensen-E-Mart eCommerce Platform 

This project is MERN Stack eCommerce Platform. It is a full-featured shopping cart with PayPal & credit/debit payments. 

See it in action at [https://tensen-e-mart.onrender.com/](https://tensen-e-mart-fis0.onrender.com/)

### Previous Repo

Due to an accidental push of the frontend/src directory to another repository, the original repository is no longer functional. Please use the following link for the correct repository: [https://github.com/pranayharishchandra/Tensen-E-Mart-2](https://github.com/pranayharishchandra/Tensen-E-Mart-2).


Old Link: [https://github.com/pranayharishchandra/Tensen-E-Mart-1](https://github.com/pranayharishchandra/Tensen-E-Mart-1)

New Link: [https://github.com/pranayharishchandra/Tensen-E-Mart-2](https://github.com/pranayharishchandra/Tensen-E-Mart-2)


> eCommerce platform built with the MERN stack & Redux.

<!---
<img src="./frontend/public/images/screens.png">
-->


<!-- toc -->

- [Features](#features)
- [Usage](#usage)
  - [Env Variables](#env-variables)
  - [Install Dependencies (frontend & backend)](#install-dependencies-frontend--backend)
  - [Paypal Credentials](#paypal-credentials)
- [Previous Repo](#previous-repo)


<!-- tocstop -->

## Features

- Full featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)

## Usage

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)

### Env Variables

Rename the `.env.example` file to `.env` and add the following

```
NODE_ENV =
PORT =
MONGO_URI =
JWT_SECRET =
PAYPAL_CLIENT_ID =
PAGINATION_LIMIT = 8
```

Change the JWT_SECRET and PAGINATION_LIMIT to what you want

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```

### Run

```

# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
cd frontend
npm run build
```

### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

```
Sample User Logins (E-mail and passwords)

admin@email.com (Admin)
123456

john@email.com (Customer)
123456

jane@email.com (Customer)
123456
```

---


### PayPal Credentials

For making payments through PayPal, you can use the following sandbox credentials:

```plaintext
Email: sb-439fv129160361@personal.example.com
Password: S=8?,"$d

Email: sb-tcjg929174143@personal.example.com
Password: >g9eI"*5```


