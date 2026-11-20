import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createListingSchema, listingStatusSchema } from './schema.ts'

describe('listingStatusSchema', () => {
  it('accepts inventory statuses', () => {
    assert.equal(listingStatusSchema.parse('draft'), 'draft')
    assert.equal(listingStatusSchema.parse('published'), 'published')
  })

  it('rejects free text', () => {
    assert.throws(() => listingStatusSchema.parse('pending'))
  })
})

describe('createListingSchema', () => {
  it('requires a non-empty title and defaults status to draft', () => {
    const parsed = createListingSchema.parse({ title: '  Cabin  ' })
    assert.equal(parsed.title, 'Cabin')
    assert.equal(parsed.status, 'draft')
  })

  it('rejects an empty title', () => {
    assert.throws(() => createListingSchema.parse({ title: '   ' }))
  })
})
