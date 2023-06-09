const { BadRequestError, UnauthenticatedError } = require("../errors")
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")

const register = async (req, res) => {
  // const tempUser = { name, email, password: hashedPassword }
  console.log(req.body)
  const user = await User.create({ ...req.body })
  const token = user.createJwt()
  console.log()
  console.log(`user ==> ${user} and token ==> ${token}`)
  // if (!name || !email || !email) {
  //   throw new BadRequestError("Please provide me ,     email and password")
  // }
  // const user = await User.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
  // res.json(req.body)
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(`Invalid Credentials`)
  }

  const token = user.createJwt()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
  // res.send("login user")
}

module.exports = { register, login }
