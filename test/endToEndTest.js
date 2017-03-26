import createMutations from '../src/index.js'
import fs from 'fs'

// TODO - replace with call to graphcool-up
const url = 'https://api.graph.cool/simple/v1/carnationleg-cloud-268'

describe('auto-mutation', () => {
  describe('end-to-end', () => {
    it('should fetch the schema and generate mutations correctly', async () => {
      const twitter = await createMutations(url)
      const userId = await twitter.createUser({name: 'Hugo'})
      const tweetId = await twitter.createTweet({authorId: userId, text: 'Test Tweet'})
      await twitter.updateTweet({id: tweetId, text: 'New Text for Tweet'})
    }).timeout(10000)
  })
})
