const AWS = require('aws-sdk');
const dotenv = require('dotenv');

const s3 = new AWS.S3();

dotenv.config();

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));

  const requestBody = JSON.parse(event.body);

  const userId = requestBody.userId;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `avatars/${userId}`,
    Expires: 60,
  };

  const url = await s3.getSignedUrlPromise('putObject', params);

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl: url }),
  };
};
