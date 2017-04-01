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
    })

    if(res.status != 200) {
      throw new Error(`Query error: Server respondend with ${res.status}, the response body is: ${res.body}`)
    }
    
    const rbody = JSON.parse(res.body)

    if(rbody.error) {
      throw new Error(`Query error: ${rbody.error.message}`)
    } else if(rbody.errors) {
      throw new Error(`Query errors: ${rbody.errors.map((x) => x.message).join('\n')}`)
    } else {
      return rbody.data
    }
  }
}
