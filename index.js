require('dotenv').config()

const express = require('express')

const app = express()
const port = process.env.NODE_PORT

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
})