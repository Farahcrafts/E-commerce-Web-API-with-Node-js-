//import express-jwt to verify the token and check if the user is an admin or not
const { expressjwt } = require("express-jwt");

//middleware function to verify the token and check if the user is an admin or not
function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    //isRevoked is a function that will be called for each request to check if the token is revoked or not,
    //  in our case we will check if the user is an admin or not,
    //  if the user is not an admin, we will revoke the token and return an error message to the client
    isRevoked: isRevoked,

    //unless is a function that will be called to exclude some routes from the token verification, in our case we will exclude the routes that are used to get the products, categories and orders, and the login and register routes for the users, because these routes are public and do not require authentication
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

//function to check if the user is an admin or not, if the user is not an admin, we will revoke the token and return an error message to the client
async function isRevoked(req, token) {
  return !token.payload.isAdmin;
}

module.exports = authJwt;
