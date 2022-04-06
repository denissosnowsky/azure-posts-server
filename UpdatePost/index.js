const Joi = require('joi')
const MiddlewareHander = require('azure-middleware')
const updatePostHandler = require('./handler.js')
const { validateBody } = require('../middleware/validator')

const schema = Joi.object().keys({
  title: Joi.string(),
  content: Joi.string(),
})

const updatePost = new MiddlewareHander()
  .use((context) => {
    validateBody(context, context.req.body, schema);
    context.next();
  })
  .use(updatePostHandler)
  .catch((error, context) => {
    context.res = {
      status: 500,
      body: error.message,
    }
    context.done()
  })
  .listen()

module.exports = updatePost