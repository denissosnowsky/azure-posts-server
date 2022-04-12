const azure = require('azure-storage')
const { queryEntities } = require('../services/tableService')
const { uploadFile } = require('../services/fileService')
const fetch = require('node-fetch')

exports.isUserNew = async (context) => {
  const fileStorageUserPhotoUrl =
    'https://storageapilalala.file.core.windows.net/posts/users/'
  const sasToken = process.env.SAS_TOKEN

  try {
    const queryUserData = new azure.TableQuery().where(
      'PartitionKey eq ?',
      context.req.user.oid,
    )
    const resultUserData = await queryEntities('Users', queryUserData)

    if (resultUserData.value.length > 0) {
      context.req.user.isNew = false
      context.req.user.photo = resultUserData.value[0].photo
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
        const fileName = `${fileStorageUserPhotoUrl}${context.req.body.userId}.png${sasToken}`
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
