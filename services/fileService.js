const {
  Aborter,
  StorageURL,
  ServiceURL,
  ShareURL,
  DirectoryURL,
  FileURL,
  SharedKeyCredential,
} = require('@azure/storage-file')

const sharedKeyCredential = new SharedKeyCredential(
  'storageapilalala',
  process.env.AZURE_STORAGE_ACCESS_KEY,
)
const pipeline = StorageURL.newPipeline(sharedKeyCredential)
const serviceURL = new ServiceURL(
  `https://storageapilalala.file.core.windows.net`,
  pipeline,
)

const shareURL = ShareURL.fromServiceURL(serviceURL, 'posts')
const directoryURL = DirectoryURL.fromShareURL(shareURL, 'users')

const uploadFile = async (buffer, fileName) => {
  try {
    const fileURL = FileURL.fromDirectoryURL(directoryURL, fileName)
    await fileURL.create(Aborter.none, Buffer.byteLength(buffer))

    await fileURL.uploadRange(
      Aborter.none,
      buffer,
      0,
      Buffer.byteLength(buffer),
    )
  } catch (error) {
    throw new Error(error)
  }
}

exports.uploadFile = uploadFile
