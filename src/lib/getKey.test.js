import makeRefKey from './getKey'


describe('getKeyRef', function () {

  it('works', async function () {

    let key = makeRefKey();
    expect(key).equal(key);
    expect(key()).equal(null);

    key(3);
    expect(key()).equal(3);
  })

});