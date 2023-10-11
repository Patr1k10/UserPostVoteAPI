const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event));

    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      const s3Info = body.Records[0].s3;

      if (!s3Info || !s3Info.object) {
        console.error("Missing S3 object information in the record");
        continue;
      }

      const userId = s3Info.object.key.split('/')[1];
      const bucketName = s3Info.bucket.name;
      const awsRegion = body.Records[0].awsRegion;  // Изменено
      const objectKey = s3Info.object.key;

      console.log('s3Info:', JSON.stringify(s3Info));

      const avatarUrl = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${objectKey}`;

      const params = {
        TableName: 'Users',
        Item: {
          'id': userId,
          'avatar': avatarUrl
        }
      };

      console.log("Params: ", JSON.stringify(params));
      await dynamo.put(params).promise();
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
};
