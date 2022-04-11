exports.validateBody = async (context, body, schema) => {
  try {
    if (!body) {
      context.res = {
        status: 400,
        body: 'Request body is empty',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': '*',
          'Access-Control-Allow-Headers':
            'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
          'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
        },
      }
      context.done()
      return
    }

    await schema.validateAsync(body)
  } catch (error) {
    context.res = {
      status: 400,
      body: error.message,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': '*',
        'Access-Control-Allow-Headers':
          'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
      },
    };
    context.done();
  }
}
