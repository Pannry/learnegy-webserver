const AWS = require('aws-sdk');

function getS3Instance() {
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  return new AWS.S3({ apiVersion: process.env.S3_API_VERSION });
}

function downloadFromS3(files) {
  return new Promise((resolve, reject) => {
    const s3 = getS3Instance();

    const Objects = [];

    files.forEach((element) => {
      let key = element.file_name;
      key = key.split('/');
      key = `${key[key.length - 2]}/${key[key.length - 1]}`;
      key = decodeURIComponent(key);
      key = { Key: key };
      Objects.push(key);
    });

    const Delete = {
      Objects,
      Quiet: false,
    };

    const params = {
      Bucket: process.env.S3_BUCKET,
      Delete,
    };

    if (params.Delete.Objects.length > 0) {
      s3.deleteObjects(params, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } else {
      resolve();
    }
  });
}

module.exports = () => downloadFromS3;
