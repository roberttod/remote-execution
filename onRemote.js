module.exports = async function onRemote (execution, clientOptions, options = {}) {
  options = {
    url: '/execute',
    ...options
  }
  const res = await window.fetch(options.url, {
    method: 'POST',
    body: JSON.stringify({
      execution: execution.toString(),
      signature: execution.signature,
      clientOptions
    })
  })
  return res.json()
}
