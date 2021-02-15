import express from 'express'

const app = express()

app.use(express.json())

app.listen(5050, () => {
  console.log('Server running at http://localhost:5050')
})
