const Joi = require('joi')
const MiddlewareHander = require('azure-middleware')

const createPostHandler = require('./handler.js')
const { validateBody } = require('../middleware/validator')
const { authMiddleware } = require('../middleware/authMiddleware')
const { isUserNew } = require('../middleware/isUserNew')

const schema = Joi.object().keys({
  blog: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  userId: Joi.string().required(),
  accessToken: Joi.string().required(),
})

const createPost = new MiddlewareHander()
  .use((context) => {
    validateBody(context, context.req.body, schema);
    context.next();
  })
  .use(authMiddleware)
  .use(isUserNew)
  .use(createPostHandler)
  .catch((error, context) => {
    context.res = {
      status: 500,
      body: error.message,
    }
    context.done()
  })
  .listen()

module.exports = createPost
