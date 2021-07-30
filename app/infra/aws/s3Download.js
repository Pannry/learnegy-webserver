const AWS = require('aws-sdk');

function getS3Instance() {
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
  });

  return new AWS.S3({ apiVersion: process.env.S3_API_VERSION });
}

function downloadFromS3(file) {
  return new Promise((resolve, reject) => {
    const s3 = getS3Instance();

    let key = file;
    key = key.split('/');
    key = `${key[key.length - 2]}/${key[key.length - 1]}`;
    key = decodeURIComponent(key);

    const downloadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Expires: 20,
      // ACL: 'public-read',
    };

    s3.getSignedUrl('getObject', downloadParams, (err, url) => {
      if (err) reject(err);
      resolve(url);
    });
  });
}

module.exports = () => downloadFromS3;
