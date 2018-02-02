import dataToSql from './dataToSql'

var data = [
	{
		"fname": "vladimir", 
		"lname":'buskin', 
		"address": "157-166 push'kinskaya" 
	},
	{
		"fname": "dima", 
		"lname":'ogo', 
		"address": "30 lenina" 
	}
]

describe('dataToSql', function() {

	it('works', function() {

		var sql = dataToSql('account', data, 'id');

		expect(sql).deep.equal("insert into [account] ([fname],[lname],[address]) output inserted.[id] values ('vladimir','buskin','157-166 push''kinskaya'),('dima','ogo','30 lenina')")
	})


})