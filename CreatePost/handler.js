const { insertEntity } = require('../services/tableService')

const createPostHandler = async (context) => {
  try {
    const { blog, title, content } = context.req.body

    const userId = context.req.user.oid

    const entityPost = {
      PartitionKey: { _: blog },
      RowKey: { _: new Date().getTime().toString() },
      title: { _: title },
      content: { _: content },
      userId: { _: userId },
    }

    const resultPost = await insertEntity('Posts', entityPost)

    let resultUser

    if (context.req.user.isNew) {
      const entityUser = {
        PartitionKey: { _: userId },
        RowKey: { _: new Date().getTime().toString() },
        name: { _: context.req.user.name },
        photo: { _: context.req.user.photo },
      }

      resultUser = await insertEntity('Users', entityUser)
    } else {
      resultUser = 'Not new'
    }

    context.res = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': '*',
        'Access-Control-Allow-Headers':
        'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
      },
      body: [{ post: resultPost, user: resultUser }],
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
