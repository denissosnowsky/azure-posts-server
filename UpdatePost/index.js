const Joi = require('joi')
const MiddlewareHander = require('azure-middleware')

const updatePostHandler = require('./handler.js')
const { validateBody } = require('../middleware/validator')
const { authMiddleware } = require('../middleware/authMiddleware')
const { isMyPost } = require('../middleware/isMyPost')

const schema = Joi.object().keys({
  title: Joi.string(),
  content: Joi.string(),
})

const updatePost = new MiddlewareHander()
  .use((context) => {
    validateBody(context, context.req.body, schema);
    context.next();
  })
  .use(authMiddleware)
  .use(isMyPost)
  .use(updatePostHandler)
  .catch((error, context) => {
    context.res = {
      status: 500,
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
  })
  .listen()

module.exports = updatePost