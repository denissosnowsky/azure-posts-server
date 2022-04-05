const { deleteEntity } = require('../services/tableService')

module.exports = async function (context, req) {
  try {
    const { blog, id } = context.bindingData

    const entity = {
      PartitionKey: { _: blog },
      RowKey: { _: id.toString() },
    }

    await deleteEntity('Posts', entity)
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
  }
}
