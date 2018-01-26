import read from './read/read'
import db from './database/db'
import insert from './insert'
import range from './lib/range'

let id = 0;
let structure = {
	location: [],
	project: [],
	permit: []
}


let getKey = (type, id) => [type,id,'asdf1234!@#$'].join("|");



read('./data.csv', function(err, data) {
	if (err) throw err;

	if (data != null) {
		id++;
		let { permit, desc, det, lat, lng } = data;

		let projectId = getKey('project',id);
		let locationId = getKey('location',id);
		let permitId = getKey('permit',id);
		
		// location is created for each record
		// permit is for each record
		// project is for each record

		structure.project.push(
			{
				id: projectId, 
				description: desc,
			}
		)
		structure.location.push(
			{
				id: locationId, 
				lat: +lat, 
				lng: +lng, 
				projectId
			}
		)
		structure.permit.push(
			{
				id: permitId, 
				projectId,
				description: desc,
			}
		)
	}
	else 
	{

		let knex = db({
			client: 'mssql',
			connection: {
				host : '127.0.0.1',
				user : 'mstar',
				password : '1',
				database : 'p'
			}
		});
		
		var insertToDb = async function (data, table, key) {

			let ids = null;

			try {
				ids = await knex(table).insert(data).returning(key);
			} catch(e) {
				
			}
			console.log('inserted', data, ids);

			return ids
		}

		insert(insertToDb, structure, {
			location: 'id',
			project: 'id',
			permit: 'id',
		});
	}
});

