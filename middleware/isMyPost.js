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
            }
            context.done()
            return
        }

        context.next()
    }catch(error){
        context.res = {
            status: 401,
            body: error.message,
        }
        context.done()
    }
}