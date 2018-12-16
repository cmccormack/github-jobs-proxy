const app = require('express')()
const chalk = require('chalk')
const fetch = require('node-fetch')
const qs = require('query-string')
const cors = require('cors')

// Set the port using environmental variable, 3000 if one doesn't exist
app.set('port', process.env.PORT || 3000)

// Handle cross-site request
app.use(cors())

// API hostname
const url = 'https://jobs.github.com'

// Helper function to call a JSON endpoint
//  Returns JSON if valid JSON, else text
const fetchJSON = (endpoint, method="GET", body=undefined) => (
    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    })
      .then(res => res.text())
      .then(text => {
        try {
          return JSON.parse(text)
        } catch (e) {
          return text
        }
      })
  )

// Root endpoint route, redirects to next route
app.get('/', (req, res, next) => res.redirect('/positions.json'))

// Primary API endpoint route
app.get('/:param', (req, res, next) => {

    const {params: {param}, query} = req
    const apiurl = `${url}/${param}?${qs.stringify(query)}`

    fetchJSON(apiurl)
    .then(response => res.json(response))
    .catch(err => res.json({success: false, msg: err.msg}))
})

// Start Express Server
const server = app.listen(app.get('port'), () => {
    const {address, port} = server.address()
    console.log(chalk.green(" ✓ ") + `server listening on ${address+port}`)
})
