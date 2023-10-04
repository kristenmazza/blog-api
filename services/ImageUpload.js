const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3Upload = async (buffer, key) => {
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
  };

  return s3client.send(new PutObjectCommand(param));
};

module.exports = { s3Upload };
