let knx = require('knex');
let {
  insert,
  knexInsert,
  mapper,
  duplicateChecker,
  writeOutput,
  getKey,
  readFull
} = require('ms-import');

// 0. DECLARE STRUCTURE, keys are table names data to be inserted into
// ===========================
let structure = {
  User: [],
  Phone: [],
};

(async function() {

  let data = await readFull('./usr.csv');

  // 1. FILL structure
  // ===========================
  data.forEach(rec => {

    // make user key
    let userId = getKey();

    let user = mapper(
      {
        // default values goes here
        id: userId // important, temporary key
      },
      rec, 
      [
        // name - table field name
        // value - source field name
        // length - checks, if value is fits (for string fields)
        {name: 'login', value: 'Company', length: 50},
        {name: 'name', value: 'FName', length: 50},
        {name: 'type', value: 'Type'},
      ]
    );

    let phones = mapper(
      {
        // default values goes here
      },
      rec,
      [
        {name: 'phone', value: 'Phone', length: 20},
        {name: 'phone2', value: 'Phone2', length: 20},
      ]
    );

    // one user for each csv row
    structure.User.push(user);

    // first phone as first record
    if (phones.phone != null) {
      structure.Phone.push({
        id: getKey(),
        userId: userId,
        phone: phones.phone
      });
    }

    // second phone as second record
    if (phones.phone2 != null) {
      structure.Phone.push({
        id: getKey(),
        userId: userId,
        phone: phones.phone2
      });
    }
  });


  // 2. VALIDATE DATA, check field unique
  // ===========================
  let dups = duplicateChecker(structure.User, d => d.login);
  // log duplicates to duplicates.json
  await writeOutput("./out/duplicates.json", dups);
  if (dups)
  {
    console.log('validation error');
    return;
  }

  // 3. PREPARE DATABASE connection and structure
  // tables are created just to show structure.
  // usually this is not needed, because you insert into existing database.
  // ===========================
  let knex = knx({
    client: 'mssql',
    connection: {
      host : '127.0.0.1',
      user : 'mstar',
      password : '1',
      database : 'test'
    }
  });

  try {
    await knex.raw(`drop table [User]`);
  }
  catch (e){}
  try {
    await knex.raw(`drop table [Phone]`);
  }
  catch (e){}

  await knex.raw(
  ` create table [User] (
      id bigint identity,
      [login] nvarchar(50),
      [name] nvarchar (50),
      [type] bigint,
    )
    create table [Phone] (
      id bigint identity,
      [userId] bigint,
      [phone] nvarchar (20),
    ) 
  `);

  // 4. RUN INSERT PROCESS
  // ===========================
  try {
    await insert(
      knexInsert(knex),
      structure,
      {
        // we must specify key column for each table
        User: 'id',
        Phone: 'id',
      },
      {
        // batch size
        batch: 1000
      }
    );
  }
  catch (e) {
    throw e;
  }
  finally {
    knex.destroy();
  }

})();