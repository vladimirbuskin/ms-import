import dataToSql from './dataToInsertSql'
import getKey2 from './getKey'

let data = [
	{
		"fname": "vladimir", 
		"lname":'buskin', 
		"address": "157-166 push'kinskaya",
		"geo": () => "geometry::STGeomFromText('LINESTRING (-106.42665 42.87465, -106.42658 42.87465)', 4326)"
	},
	{
		"fname": "dima", 
		"lname":'ogo', 
		"address": "30 lenina",
		"geo": null
	}
];

describe('dataToInsertSql', function() {

	it('works', function() {

		let sql = dataToSql('account', data, 'id');

		expect(sql).deep.equal("insert into [account] ([fname],[lname],[address],[geo]) output inserted.[id] values ('vladimir','buskin','157-166 push''kinskaya',geometry::STGeomFromText('LINESTRING (-106.42665 42.87465, -106.42658 42.87465)', 4326)),('dima','ogo','30 lenina',null)")
	});

	it('works no key', function() {

		let sql = dataToSql('account', data, '');

		expect(sql).deep.equal("insert into [account] ([fname],[lname],[address],[geo]) values ('vladimir','buskin','157-166 push''kinskaya',geometry::STGeomFromText('LINESTRING (-106.42665 42.87465, -106.42658 42.87465)', 4326)),('dima','ogo','30 lenina',null)")
	});

	it('empty col', function () {

		let sql = dataToSql('account', [{fname:'vladimir',lname:undefined}], '');
		expect(sql).deep.equal("insert into [account] ([fname],[lname]) values ('vladimir',null)");
	});

});