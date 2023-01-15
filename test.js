import assert from 'node:assert/strict'
import test from 'node:test'
import {afinn165FinancialMarketNews} from './index.js'

test('afinn165FinancialMarketNews', () => {
  assert.equal(afinn165FinancialMarketNews.positive, 2)
  assert.equal(afinn165FinancialMarketNews['self-deluded'], -2)
  assert.equal(afinn165FinancialMarketNews.damn, -2)
  assert.equal(afinn165FinancialMarketNews.futile, -2)
})
