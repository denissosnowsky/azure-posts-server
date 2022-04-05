const { updateEntity } = require('../services/tableService')

module.exports = async function (context, req) {
  try {
    if (!req.body) {
      context.res = {
        status: 500,
        body: 'Please pass a request body',
      }
      return
    }

    const { title, content } = req.body

    if (!title && !content) {
      context.res = {
        status: 500,
        body: 'Please pass a title or content',
      }
    }

    const { blog, id } = context.bindingData

    const entity = {
      PartitionKey: { _: blog },
      RowKey: { _: id.toString() },
    }

    if (title) entity.title = { _: title};
    if (content) entity.content = { _: content};

    await updateEntity('Posts', entity);

  } catch (error) {
    context.res = {
      status: 500,
      body: error.message,
    }
  }
}
