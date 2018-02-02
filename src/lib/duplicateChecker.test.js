import duplicateChecked from './duplicateChecker'

var ar = [
  {name: 'vlad', city: 'izh'},
  {name: 'dima', city: 'mozh'},
  {name: 'igor', city: 'sara'},
  {name: 'vlad', city: 'votk'},
]

describe('duplicateChecked', function() {
  
  it('by string', function () {
    var dup = duplicateChecked(ar, 'name');    
    expect(dup).deep.equal(
      {
        vlad: [
          { name: 'vlad', city: 'izh' },
          { name: 'vlad', city: 'votk' } 
        ]
      }
    )
  })

  it('by func', function () {
    var dup = duplicateChecked(ar, d => d['name']);
    expect(dup).deep.equal(
      {
        vlad: [
          { name: 'vlad', city: 'izh' },
          { name: 'vlad', city: 'votk' } 
        ]
      }
    )
  })

  it('transform', function () {
    var dup = duplicateChecked(ar, 'name', d => d.city);
    expect(dup).deep.equal(
      {
        vlad: [
          'izh',
          'votk'
        ]
      }
    )
  })

  it('transform arr', function () {
    var dup = duplicateChecked(ar, 'name', ["city"]);
    expect(dup).deep.equal(
      {
        vlad: [
          {city:'izh'},
          {city:'votk'}
        ]
      }
    )
  })

  it('no duplic, null', function () {
    var dup = duplicateChecked(ar, 'city');
    expect(dup).equal(null)
  })

})