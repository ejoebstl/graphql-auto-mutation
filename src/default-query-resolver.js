const popsicle = require('popsicle')

export default function createQueryResolver(endpoint, headers) {
  // Create query resolver function
  return async function(query, vars) {
    // For default, we're using raw HTTP and rely on the server for validation. 
    const res = await popsicle.request({
      method: 'POST',
      url: endpoint,
      headers: headers || { },
      body: {
        query: query,
        variables: vars || { }
      }
    }).use(popsicle.plugins.parse('json'))

    if(res.status != 200) {
      throw new Error(`Query error: Server respondend with ${res.status}`)
    }
    else if(res.body.error) {
      throw new Error(`Query error: ${res.body.error.message}`)
    } else {
      return res.body.data
    }
  }
}
