const jwt = require("jsonwebtoken");

exports.authMiddleware = (context) => {
  if (context.req.method === 'OPTIONS') {
    return next()
  }
  try {
    const { accessToken, userId } = context.req.body

    if (!context.req.headers.authorization || !accessToken || !userId) {
        context.res = {
          status: 401,
          body: 'Authorization error',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-Requested-With': '*',
            'Access-Control-Allow-Headers':
              'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
          },
        }
        context.done()
        return
      }

    const tokenJwt = context.req.headers.authorization.split(' ')[1]

    if (!tokenJwt) {
      context.res = {
        status: 401,
        body: 'Authorization error',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': '*',
          'Access-Control-Allow-Headers':
            'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
          'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
        },
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': '*',
        'Access-Control-Allow-Headers':
          'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
      },
    }
    context.done()
  }
}
