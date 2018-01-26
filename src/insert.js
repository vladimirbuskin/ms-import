import knex from 'knex'


var knx = knex({
  client: 'mssql',
  connection: {
    host : '127.0.0.1',
    user : 'mstar',
    password : '1',
    database : 'p'
  }
});

async function n() {

  var r = await knx('Entity').insert([
    {Name: 'name1', prefix:'p1'}, 
    {Name: 'name2', prefix:'p2'}, 
    {Name: 'name3', prefix:'p3'}, 
  ]).returning('id')
  console.log('res', r);
}

n()