const azure = require('azure-storage');
const { queryEntities } = require('../services/tableService');

module.exports = async function (context, req) {
  try {
    const query = new azure.TableQuery();

    const result = await queryEntities("Users", query);

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
