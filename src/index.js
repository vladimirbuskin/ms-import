import read from './read/read'

var id = 0;

var structure = {
	projects: [],
	permits: [],
	locations: []
}
/*
*/

read('./data.csv', function(err, data) {
	if (err) throw err;
	if (data != null) {
		// { permit: 'pm123', desc: 'simple1', det: 'details', lat: 32.1, lng: '-128.3' }
		console.log(data);
		var { permit, desc, det, lat, lng } = data;

		id++;

		let projectId = 'project'+id;
		let locationId = 'location'+id;
		let permitId = 'permit'+id;
		
		// location is created for each record
		// permit is for each record
		// project is for each record

		structure.projects.push(
			{
				id: projectId, 
				desc,
			}
		)
		structure.locations.push(
			{
				id: locationId, 
				lat, 
				lng,
				projectId
			}
		)
		structure.permits.push(
			{
				id: permitId, 
				projectId,
				desc,
			}
		)

	}
	else {
		console.log(structure);
	}
});