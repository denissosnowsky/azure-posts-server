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
      body: error.message,
    }
  }
}
