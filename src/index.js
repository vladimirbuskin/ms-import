import read from './read/read'
import db from './database/db'
import insert from './insert'

let id = 0;
let structure = {
	project: [],
	permit: [],
	location: []
}


let getKey = (type, id) => [type,id,'asdf1234!@#$'].join("|");


let knex = db({
  client: 'mssql',
  connection: {
    host : '127.0.0.1',
    user : 'mstar',
    password : '1',
    database : 'p'
  }
});


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
				lat, 
				lng,
				projectId
			}
		)
		structure.permit.push(
			{
				id: permitId, 
				projectId,
				desc,
			}
		)
	}
	else {
		//insert(knex, structure);
		console.log(structure)
	}
});

