const _ = require('lodash')
const express = require('express')
const executeMiddlewear = require('../middlewear')

const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const compiler = webpack(require('./webpack.config'))

const booksService = {
  get ({ authorId }) {
    return [{
      authorId: 1,
      title: 'Mary Poppins'
    }, {
      authorId: 2,
      title: 'To kill a Mockingbird'
    }].filter(book => book.authorId === authorId)
  }
}
const authorService = {
  get ({ firstname }) {
    return [{
      id: 1,
      firstname: 'Dan',
      lastname: 'Brown'
    }, {
      id: 2,
      firstname: 'Laurie',
      lastname: 'Paul'
    }].filter(author => author.firstname === firstname)
  }
}

const app = express()
app.get('/', (req, res) => {
  res.send(`
  <html>
  <body>
    <div id='root' />
    <script src="/bundle.js"></script>
    </body>
  </html>
  `)
})
app.use('/execute', executeMiddlewear({ booksService, authorService, _ }))
app.use(middleware(compiler))
app.listen(1620)
