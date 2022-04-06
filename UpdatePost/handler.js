const { updateEntity } = require('../services/tableService')

const updatePostHandler = async (context) => {
  try {

    const { title, content } = context.req.body

    const { blog, id } = context.bindingData

    const entity = {
      PartitionKey: { _: blog },
      RowKey: { _: id.toString() },
    }

    if (title) entity.title = { _: title }
    if (content) entity.content = { _: content }

    await updateEntity('Posts', entity)

    context.done()
  } catch (error) {
    context.res = {
      status: 500,
      body: error.message,
    }
    context.done()
  }
}

module.exports = updatePostHandler
