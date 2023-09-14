const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const uuid = require('uuid').v4;

exports.s3Upload = async (buffer, key) => {
  const s3client = new S3Client();
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
  };

  return s3client.send(new PutObjectCommand(param));
};
