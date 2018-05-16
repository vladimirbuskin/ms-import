import dataToUpdateSql from './dataToUpdateSql'
import getKey2 from './getKey'

let data = [
	{
		"id": 1,
		"primaryPhone": 2,
	},
	{
    "id": 2,
    "primaryPhone": 3,
  }
];

describe('dataToUpdateSql', function() {

	it('works', function() {

		let sql = dataToUpdateSql('account', data, 'id');

		expect(sql).deep.equal('update "account" set "primaryPhone"=2 where "id"=1\nupdate "account" set "primaryPhone"=3 where "id"=2')
	});

});