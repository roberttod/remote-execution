## Remote Execution

What if instead of telling the server *_what you want_* you told it *_how to get it for you_*?

### Secure remote execution
Tying data together on the client side creates a lot of calls to multiple APIs, that most of time need to be run sequentially. GraphQL is a good solution for this, giving you a standard way of telling the server how to tie the data together.

Remote Execution solves the problem in a different way, by letting the client send server code to the server. In other words, rather than telling the server *what it wants*, the client tells the server *how to get what it wants*.

Of course server execution is insecure, which is why you sign the execution code at build time to be validated by the server! By using a webpack plugin, the signatures are built into your executions automatically.

# Example, getting a book by author ID

client/executions/getBooksByName.js
```js
module.exports = async (
  { req, res, booksService, authorService, _ },
  { firstname, first = 0, last = 10 }
) => {
  const authors = await authorService.get({ firstname })
  const authorBooks = await Promise.all(authors.map(async (author) => {
    const books = await booksService.get({ authorId: author.id })
    return books.map(book => ({ ...book, author }))
  }))
  const books = _.flatten(authorBooks)
  res.json(books.slice(first, last))
}
```

client/client.js
```js
const onRemote = require('remote-execution/onRemote')
const getBooksByName = require('./executions/getBooksByName')

async function printBooksByDan () {
  const root = document.querySelector('#root')
  const booksByDan = await onRemote(getBooksByName, { firstname: 'Dan' })
  booksByDan.forEach(book => {
    const div = document.createElement('div')
    div.innerHTML = `${book.author.firstname} ${book.author.lastname} ${book.title}`
    root.appendChild(div)
  })
}
printBooksByDan()
```

webpack.conf.js
```js
const path = require('path')

module.exports = {
  entry: './example/client/client.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /executions\//,
        use: {
          loader: 'remote-execution-loader',
          options: {
            key: path.resolve(__dirname, './keys/private')
          }
        }
      }
    ]
  }
}
```

server/server.js
```js
const _ = require('lodash')
const express = require('express')
const executeMiddlewear = require('remote-execution/middlewear')

const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const compiler = webpack(require('./webpack.config'))

const booksService = require('./booksService')
const authorService = require('./authorService')

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
```
