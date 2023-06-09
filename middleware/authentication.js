const User = require("../models/User")

const jwt = require("jsonwebtoken")
const { UnauthenticatedError } = require("../errors")

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  // console.log(authHeader.accessToken)
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Aunthentication required")
  }
  const token = authHeader.split(" ")[1]
  console.log(`$token ==> ${token}`)
  console.log(JSON.stringify(token))
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId, name: payload.name }
    console.log(`user==> ${req.user.userId}`)
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
}
module.exports = auth
