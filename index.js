require('dotenv').config()
const path = require('path')

const express = require('express')

const app = express()
const port = process.env.NODE_PORT

app.use('/docs', express.static('docs'))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
})