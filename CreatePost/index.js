const Joi = require('joi')
const MiddlewareHander = require('azure-middleware')
const createPostHandler = require('./handler.js')
const { validateBody } = require('../middleware/validator')

const schema = Joi.object().keys({
  blog: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
})

const createPost = new MiddlewareHander()
  .use((context) => {
    validateBody(context, context.req.body, schema);
    context.next();
  })
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
