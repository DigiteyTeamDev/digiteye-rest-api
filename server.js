const express = require('express');
const AWS = require('aws-sdk');

require('dotenv').config();
const cors = require('cors');

// ตั้งค่า AWS
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

// สร้าง DynamoDB object
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route สำหรับอ่านค่าทั้งหมดจากตาราง
app.get('/getAllArtVersions', async (req, res) => {
  const params = {
    TableName: "digiteye-artventurenft-app-check-version"
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (error) {
    console.error("Error while fetching data: ", error);
    res.status(500).send("Error occurred while fetching data.");
  }
});

app.get('/getiOSVersion', async (req, res) => {
  const params = {
    TableName: "digiteye-artventurenft-app-check-version",
    Key: {
      "current-version": "ios" // เป็น primary key
    }
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (data.Item) {
      res.status(200).json(data.Item);
    } else {
      res.status(404).send('iOS version not found');
    }
  } catch (error) {
    console.error("Error while fetching data: ", error);
    res.status(500).send("Error occurred while fetching data.");
  }
});
app.get('/getAndroidVersion', async (req, res) => {
  const params = {
    TableName: "digiteye-artventurenft-app-check-version",
    Key: {
      "current-version": "android" // เป็น primary key
    }
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (data.Item) {
      res.status(200).json(data.Item);
    } else {
      res.status(404).send('iOS version not found');
    }
  } catch (error) {
    console.error("Error while fetching data: ", error);
    res.status(500).send("Error occurred while fetching data.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
