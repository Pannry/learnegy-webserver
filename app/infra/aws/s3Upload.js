const AWS = require('aws-sdk');
const fs = require('fs');

function getS3Instance() {
  AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  return new AWS.S3({ apiVersion: '2006-03-01' });
}

function uploadToS3(file, user) {
  return new Promise((resolve, reject) => {
    const s3 = getS3Instance();

    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: `${user}/${file.filename}`,
      Body: fs.createReadStream(file.path),
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) reject(err);
      resolve(data.Location);
    });
  });
}

module.exports = () => uploadToS3;
