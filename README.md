<h1 id="title" align="center">Coffee Shop Backend</h1>

"Coffee Shop" is an API built using Express.js. Users can create accounts, view menus, and place orders for pickup or delivery.

<h2>💻 Built with</h2>

Technologies used in the project:

*   [NodeJS](https://nodejs.org/)
*   [ExpressJS](https://expressjs.com/)
*   [PostgreSQL](https://www.postgresql.org/)
*   [MongoDB](https://www.mongodb.com)
*   [JWT](https://github.com/auth0/node-jsonwebtoken)

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone this repository</p>

```sh
git clone https://github.com/wyakaga/coffeeshop-backend.git
```

<p>2. Enter folder directory</p>

```sh
cd coffeeshop-backend
```

<p>3. Install with npm</p>

```sh
npm install
```

<p>4. Create .env file</p>

```env
SERVER_PORT = [your server port]
JWT_SECRET = [your JWT secret]

DB_HOST = [your database host]
DB_NAME = [your database name]
DB_PORT = [your database port]
DB_USER = [your database username]
DB_PWD = [your database password]

MONGO_USERNAME = [your MongoDB username]
MONGO_PWD = [your MongoDB password]
MONGO_HOST = [your MongoDB host]

CLOUD_NAME = [your Cloudinary name]
CLOUD_KEY = [your Cloudinary key]
CLOUD_SECRET = [your Cloudinary secret]
CLOUD_FOLDER = [your Cloudinary folder]
```

<p>5. Run the development server with npm</p>

```sh
npm run dev
```

<h2>🚀 Demo</h2>

You can click the demo site [here!](https://coffeeshop-backend.vercel.app/)

<h2>📫 Postman Documentation</h2>

You can click [here](https://documenter.getpostman.com/view/26776035/2s93m4ZPDq)

<h2>Database structure</h2>

<img src="https://i.imgur.com/bab38NF.png" alt="database structure">

Or you can view the detail [here](https://dbdiagram.io/d/6488f350722eb77494e937e7)

<h2>🛡️ License:</h2>

This project is licensed under the ISC license

<h2>Related Projects</h2>

* [Coffee Shop Web App (Web front-end for this API)](https://github.com/wyakaga/coffeeshop-fe)
* [Coffee Shop Mobile App (Mobile app front-end for this API)](https://github.com/wyakaga/coffee-shop-mobile)