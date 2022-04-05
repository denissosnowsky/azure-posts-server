const { insertEntity } = require('../services/tableService')

const createPostHandler = async (context) => {
  try {
    const { blog, title, content } = context.req.body

    const entity = {
      PartitionKey: { _: blog },
      RowKey: { _: new Date().getTime().toString() },
      title: { _: title },
      content: { _: content },
    }

    const result = await insertEntity('Posts', entity)

    context.res = {
      body: result,
    }
    context.done()
  } catch (error) {
    context.res = {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': '*',
        'Access-Control-Allow-Headers':
          'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
      },
      body: error.message,
    }
    context.done()
  }
}

module.exports = createPostHandler
