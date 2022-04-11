const Joi = require('joi')
const MiddlewareHander = require('azure-middleware')

const deletePostHandler = require('./handler.js')
const { validateBody } = require('../middleware/validator')
const { authMiddleware } = require('../middleware/authMiddleware')
const { isMyPost } = require('../middleware/isMyPost')

const schema = Joi.object().keys({
  userId: Joi.string().required(),
  accessToken: Joi.string().required(),
})

const deletePost = new MiddlewareHander()
  .use((context) => {
    validateBody(context, context.req.body, schema);
    context.next();
  })
  .use(authMiddleware)
  .use(isMyPost)
  .use(deletePostHandler)
  .catch((error, context) => {
    context.res = {
      status: 500,
      body: error.message,
    }
    context.done()
  })
  .listen()

module.exports = deletePost