const azure = require('azure-storage');
const { queryEntities } = require('../services/tableService');

module.exports = async function (context, req) {
  try {
    const {blog, id} = context.bindingData;

    const query = new azure.TableQuery().where("PartitionKey eq ? and userId eq ?", blog, id);

    const result = await queryEntities("Posts", query);

    context.res = {
      body: result,
    }
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
