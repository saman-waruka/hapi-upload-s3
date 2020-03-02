require("dotenv").config();

const aws = require("aws-sdk"); // import aws-sdk
// Setting aws configurations
aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.REGION
});
console.log(" Env \nsecretAccessKey", process.env.SECRET_ACCESS_KEY);
console.log("accessKeyId", process.env.ACCESS_KEY_ID);
console.log("REGION", process.env.REGION);
console.log("bucketName", process.env.BUCKET_NAME);
// Decent bucket name
const bucketName = process.env.BUCKET_NAME;
// Initiating S3 instance
const s3 = new aws.S3({
  apiVersion: "2006-03-01",
  //   params: { Bucket: bucketName }
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
// Options you can choose to set to accept files upto certain size limit
const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
// The heart
// "Key" accepts name of the file, keeping it a timestamp for simplicity
// "Body" accepts the file

async function upload(file, name) {
  console.log(" Upload called");
  const params = {
    Bucket: bucketName,
    // Key: `${process.env.BUCKET_KEY_PREFIX}${Date.now().toString()}_${name}`,
    Key: `${process.env.BUCKET_KEY_PREFIX}${name}`,
    Body: file
  };
  let fileResp = null;
  await s3
    .upload(params, options)
    .promise()
    .then(res => {
      fileResp = res;
    });
  return fileResp;
}
module.exports = upload;
