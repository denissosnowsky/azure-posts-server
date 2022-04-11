const azure = require('azure-storage')
const { queryEntities } = require('../services/tableService')
const { uploadFile } = require('../services/fileService')
const fetch = require('node-fetch')

exports.isUserNew = async (context) => {
  try {
    const queryUserData = new azure.TableQuery().where(
      'PartitionKey eq ?',
      context.req.user.oid,
    )
    const resultUserData = await queryEntities('Users', queryUserData)

    if (resultUserData.value.length > 0) {
      context.req.user.isNew = false
      context.req.user.photo = resultUserData.value.userPhoto
    } else {
      const blob = await fetch(
        `https://graph.microsoft.com/v1.0/users/${context.req.body.userId}/photo/$value`,
        {
          headers: {
            Authorization: `Bearer ${context.req.body.accessToken}`,
          },
        },
      ).then((res) => {
        const resType = String(res.status)[0]
        return resType == 4 || resType == 5 ? '' : res.blob()
      })

      if (blob) {
        const fileName = `${context.req.body.userId}.png`
        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        context.req.user.photo = fileName
        await uploadFile(buffer, fileName)
      } else {
        context.req.user.photo = 'No Photo'
      }


      context.req.user.isNew = true
    }
    context.next()
  } catch (error) {
    context.res = {
      status: 400,
      body: error.message,
    }
    context.done()
  }
}
