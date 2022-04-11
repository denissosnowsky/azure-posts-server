const azure = require('azure-storage');
const { queryEntities } = require('../services/tableService');

exports.isMyPost = async (context) => {
    try{
        const { blog, id } = context.bindingData;

        const query = new azure.TableQuery().where("PartitionKey eq ? and RowKey eq ? and userId eq ?", blog, id.toString(), context.req.user.oid);

        const result = await queryEntities("Posts", query);

        if (result.value < 1) {
            context.res = {
            status: 401,
            body: 'Authorization error',
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

        context.next()
    }catch(error){
        context.res = {
            status: 401,
            body: error.message,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'X-Requested-With': '*',
                'Access-Control-Allow-Headers':
                  'X-requested-with,Content-type,Accept,Origin,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Allow-Methods',
                'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
              },
        }
        context.done()
    }
}