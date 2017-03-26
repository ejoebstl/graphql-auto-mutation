import { createMutationObjectFromSchema, createMutationObject } from 'mutation-factory'
import { createQueryResolver} from 'default-query-resolver'

async function create(endpoint, auth) {
  return createWithHeaders(endpoint, auth ? { 'Authorization': auth } : { })
}

async function createWithHeaders(endpoint, headers) {
  return createWithResolver(createQueryResolver(endpoint, headers))
}

function createWithSchema(endpoint, schema, auth) {
  return createWithSchemaHeaders(endpoint, schema, auth ? { 'Authorization': auth } : { })
}

function createWithSchemaAndHeaders(endpoint, schema, headers) {
  return createWithResolverAndSchema(createQueryResolver(endpoint, headers), schema)
}

async function createWithResolver(queryResolver) {
  return createMutationObject(queryResolver)
}

function createWithResolverAndSchema(queryResolver, schema) {
  return createMutationObjectFromSchema(queryResolver, schema)
}

create.withHeaders = createWithHeaders
create.withResolver = createWithResolver
create.withSchema = createWithSchema
create.withSchemaAndHeaders = createWithSchemaAndHeaders
create.withResolverAndSchema = createWithResolverAndSchema

default export create
