const express = require('express')
const path = require('path')
const app = express();

const PUBLIC_FOLDER = path.join(__dirname, '../public')
app.use(express.static(PUBLIC_FOLDER))

app.listen(3000, () => {
    console.log('listening to 3000')
})