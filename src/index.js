const express = require('express')
const path = require('path')
const app = express();

const PORT = process.env.PORT || 3000

const PUBLIC_FOLDER = path.join(__dirname, '../public')
app.use(express.static(PUBLIC_FOLDER))

app.listen(PORT, () => {
    console.log(`listening to ${PORT}`)
})