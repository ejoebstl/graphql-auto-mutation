
async function fetchSchema(queryResolver) {
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        mutationType { 
          name 
          fields {
            name
            args {
              name
              type {
                kind
                name
                ofType {
                  kind
                  name
                  ofType{
                    kind
                    name
                    ofType{
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  return (await queryResolver(introspectionQuery)).__schema
}

function createMutationFunction(queryResolver, mutationObject) {
  return async function(args) {

    // Fetch all required arguments
    const nonNullableTypes = mutationObject.args.filter(a => a.type.kind == 'NON_NULL')

    // Check if we have missing or extra args
    const missingArgs = nonNullableTypes.filter(a => args[a.name] === undefined)
    const extraArgs = Object.keys(args).filter(a => mutationObject.args.filter(x => a == x.name).length == 0) 

    if(missingArgs.length > 0) {
      throw new Error('The following arguments are missing: ' + missingArgs.map(a => a.name).join(', '))
    }

    if(extraArgs.length > 0) {
      throw new Error('The following extra arguments were passed: ' + extraArgs.join(', '))
    }

    const toList = name => `[${name}]`;
    const toNonNull = name => name + '!';
    const toIDLTypeName = type => {
      switch (type.kind) {
        case 'LIST':
          return toList(toIDLTypeName(type.ofType));
        case 'NON_NULL':
          return toNonNull(toIDLTypeName(type.ofType));
        default:
          return type.name;
      }
    };
    
    // Combine our input object with the schema types
    const variables = Object.keys(args).map(a => {
      const field = mutationObject.args.filter(x => a == x.name)[0]

      return {
        name: field.name,
        type: toIDLTypeName(field.type)
      }
    })

    // Build the query
    const varDecl = variables.map(k => '$' + k.name + ': ' + k.type).join(', \n') 
    const varAssignment = variables.map(k => k.name + ': ' + '$' + k.name).join(', \n') 

    const mutation = 
      `mutation dynamic_mutation(
        ${varDecl}
      ) {
        resultId: ${mutationObject.name} (
          ${varAssignment}
        ) {
          id
        }
      }`

    // Execute and return id
    return (await queryResolver(mutation, args)).resultId.id
  }
}

export function createMutationObjectFromSchema(queryResolver, schema) {
  const mutations = schema.mutationType.fields

  let o = {}

  mutations.forEach((m) => {
    o[m.name] = createMutationFunction(queryResolver, m)
  })

  return o
}

export async function createMutationObject(queryResolver) {
  const schema = await fetchSchema(queryResolver)

  return createMutationObjectFromSchema(queryResolver, schema)
}

