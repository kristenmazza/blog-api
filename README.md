# Blog API

There are a few other repositories associated with this blog project:

- Blog CMS repo: https://github.com/kristenmazza/blog-cms
- Blog client repo: https://github.com/kristenmazza/blog-client

The Blog API serves as the backend for a blog system. The API follows RESTful design principles with routes organized around posts, comments, authentication, and users. CRUD operations for posts and comments are performed through the endpoints, and user authentication for securing editing functions is included.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Passport.js and jsonwebtoken
- Bcryptjs
- Express-validator (for validating/sanitizing form data)
- AWS S3 (for image storage)
- Multer (for handling form data)

## Getting Started

Follow these steps to get the Blog API up and running on your local machine.

1. This project uses MongoDB for the database and an AWS S3 bucket for image storage. See the relevant documentation for setup.
2. Install dependencies using `npm install`.
3. Create a `.env` file in the project root and add the following variables:
   - MONGODB_URI=Your MongoDB connection string
   - TOKEN_SECRET=Your access token
   - AWS_ACCESS_KEY_ID=Your access key id for AWS
   - AWS_SECRET_ACCESS_KEY=Your secret access key for AWS
   - AWS_REGION=Your AWS region
   - AWS_BUCKET_NAME=Your bucket name
4. Use `npm run serverstart` to start the server in development mode.
5. You can test your API using various methods, including using tools like curl or Postman to send HTTP requests.

## Deployment to Fly.io

The Express.js backend is deployed as a Fly VM to Fly.io. The definition for the deployment is in [fly.toml](./fly.toml) and it references the [Dockerfile](./Dockerfile).

The Fly.io command line interface is called `fly`. Install it with Homebrew package `flyctl`:

    brew install flyctl

To deploy change to Fly.io:

    fly deploy
