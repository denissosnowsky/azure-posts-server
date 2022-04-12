const jwt = require("jsonwebtoken");

exports.authMiddleware = (context) => {
  if (context.req.method === 'OPTIONS') {
    return next()
  }
  try {

    if (!context.req.headers.authorization) {
        context.res = {
          status: 401,
          body: 'Authorization error',
        }
        context.done()
        return
      }

    const tokenJwt = context.req.headers.authorization.split(' ')[1]

    if (!tokenJwt) {
      context.res = {
        status: 401,
        body: 'Authorization error',
      }
      context.done()
      return
    }

    const decodedData = jwt.decode(tokenJwt)
    context.req.user = decodedData
    context.next()
  } catch (error) {
    context.res = {
      status: 401,
      body: error.message,
    }
    context.done()
  }
}
