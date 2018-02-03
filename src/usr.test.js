var usr = require('./usr')

describe.skip('full integration test, skipped by default', function () {

  it('works', async function () {
    let success = await usr();
    expect(success).equal(true);
  })

})