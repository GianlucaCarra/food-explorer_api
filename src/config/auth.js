module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || "default",
    expiresIn: "2d"
  }
}