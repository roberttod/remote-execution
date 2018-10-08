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
