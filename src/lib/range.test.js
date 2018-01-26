import range from './range'

describe('insert', function () {

  it('required params', async function () {
    expect(range(2)).deep.eql([1,2]);
  })

  it('required 2', async function () {
    expect(range(0, 2)).deep.eql([0,1,2]);
  })

})