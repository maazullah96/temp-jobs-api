const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
    // maxlength: 12,
  },
})

UserSchema.pre("save", async function () {
  //   const user = this;
  // dont use req.body here
  console.log(this)
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  console.log(`schema ==> ${this.password}`)
  // next()
})

UserSchema.methods.createJwt = function () {
  console.log(`this ==> ${this}`)
  const token = jwt.sign(
    { userId: this._id, name: this.name },
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
    {
      // eslint-disable-next-line no-undef
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
  console.log(`token ==> ${token}`)
  return token
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  console.log(`${candidatePassword} <==> ${this.password}`)
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}
module.exports = mongoose.model("User", UserSchema)
