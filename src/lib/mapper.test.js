import mapper from './mapper'

var d = {
  "fname": "vladimir", 
  "lname":'buskin', 
  "address": "157-166 pushkinskaya" 
}

describe('mapper', function() {


  it('works', function() {

    var r = mapper(
      {},
      d,
      [
        {"name":"firstName", value:"fname"},
        {"name":"lastName", value:"lname"},
        {"name":"workAddress", value:"address"},
        {"name":"fullName", value: d => d['fname'] + d['lname']},
      ]
    )

    expect(r).deep.equal({
      firstName:"vladimir",
      lastName:"buskin",
      workAddress: "157-166 pushkinskaya",
      fullName:"vladimirbuskin",
    })
  })

  it('skipEmpty name', function() {

    var r = mapper(
      {},
      d,
      [
        {name:"firstName", value:"fname"},
        {name:"lastName", value:"lname"},
        {name:"", value:"address"},
      ]
    )

    expect(r).deep.equal({
      firstName:"vladimir",
      lastName:"buskin"
    })
  })

  it('error', function() {

    var er = null;
    try {
      var r = mapper(
        {},
        d,
        [
          {"name":"firstName", value:"fname"},
          {"name":"lastName", value:"lname"},
          {"name":"workAddress", value:"address"},
          {"name":"fullName", value: d => d['fname'] + d['lname']},
          {"name":"nonExisting", value:"nonExisting"},
        ]
      )
    }
    catch(e) {
      er = e;
    }
    expect(er).not.equal(null)
  })

  it('error 2', function() {
    var er = null;
    try {
      var r = mapper(
        {},
        d,
        [
          // numbers are not allowed, const should go to first param, or as function () => 1
          {"name":"column1", value:2},
        ]
      )
    }
    catch(e) {
      er = e;
    }
    expect(er).not.equal(null);
    expect(er.message.indexOf('mapper value could be string')).equal(0);
  })

  it('length works', function() {
    var r = mapper(
      {},
      d,
      [
        {"name":"firstName", value:"fname", length: 10},
        {"name":"lastName", value:"lname"},
      ]
    )
  })

  it('length error', function() {

    var er = null;
    try {
      var r = mapper(
        {},
        d,
        [
          {"name":"firstName", value:"fname", length: 3},
          {"name":"lastName", value:"lname"},
        ]
      )
    }
    catch(e) {
      er = e.message;
    }
    expect(er).equal('value "fname" is longer than 3 characters: {"fname":"vladimir","lname":"buskin","address":"157-166 pushkinskaya"}')
  })

})