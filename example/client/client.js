const onRemote = require('../../onRemote')
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
