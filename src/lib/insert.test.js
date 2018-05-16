import insert2 from './insert'
import {replaceKeys} from './insert'
import range from './range'
import getKey from './getKey'

let insertToDb = (chunk, tableName, key) => {
  return range(chunk.length).map(k => tableName + k);
};
let updateToDb = (chunk, tableName, key) => {
  return chunk.length;
};

describe('insert2', function () {

  it('works', async function () {

    let userId1 = getKey();
    let userId2 = getKey();
    let phoneId1 = getKey();
    let phoneId2 = getKey();
    let phoneId3 = getKey();

    let struct = {
      user: [
        {id: userId1, name: 'vladimir' },
        {id: userId2, name: 'igor'},
      ],
      phone: [
        {id: phoneId1, userId: userId1, phone: '555-111'},
        {id: phoneId2, userId: userId1, phone: '555-222'},
        {id: phoneId3, userId: userId2, phone: '555-222'},
      ]
    };

    let res = await insert2(insertToDb, updateToDb, struct, {user: 'id', phone: 'id'});
    expect(res).deep.equal({
      user: [
        {id: 'user1', name: 'vladimir'},
        {id: 'user2', name: 'igor'}
      ],
      phone: [
        {id: 'phone1', userId: 'user1', phone: '555-111'},
        {id: 'phone2', userId: 'user1', phone: '555-222'},
        {id: 'phone3', userId: 'user2', phone: '555-222'}
      ]
    })
  });

  it('works2', async function () {

    let userId1 = getKey();
    let userId2 = getKey();
    let phoneId1 = getKey();
    let phoneId2 = getKey();
    let phoneId3 = getKey();

    let struct = {
      user: [
        // allow single quote
        {id: userId1, name: "vladimir's", primaryPhone: phoneId2},
        {id: userId2, name: 'igor', primaryPhone: phoneId3},
      ],
      phone: [
        // allows key value,
        // allows function value
        {id: phoneId1, userId: 'user44', phone: ()=>"555-111"},
        {id: phoneId2, userId: userId2, phone: '555-222'},
        {id: phoneId3, userId: userId1, phone: '555-222'},
      ]
    };

    // check that chunk has no functions, only primitive values
    let insertToDb2 = (chunk, tableName, key) => {
      expect(chunk.every(x => !hasFunctions(x))).equal(false);
      return range(chunk.length).map(k => tableName + k);
    };

    let res = await insert2(insertToDb2, updateToDb, struct, {user: 'id', phone: 'id'});
    expect(res).deep.equal({
      user: [
        {id: 'user1', name: "vladimir's", primaryPhone: "phone2"},
        {id: 'user2', name: 'igor', primaryPhone: "phone3"},
      ],
      phone: [
        {id: 'phone1', userId: 'user44', phone: "555-111"},
        {id: 'phone2', userId: 'user2', phone: '555-222'},
        {id: 'phone3', userId: 'user1', phone: '555-222'}
      ]
    })
  });

});


function getValues(r) {
  return Object.keys(r).map(k => r[k])
}

function hasFunctions(r) {
  return getValues(r).every(v => typeof(v) !== 'function')
}