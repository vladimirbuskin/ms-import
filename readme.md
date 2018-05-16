# BATCH Import CSV into Relational Database

This utility helps inserting big amount of relational data into RDB.
This could be CSV or any other source.
Usually to insert data into several related tables, you do this with this algorithm.

1. Read CSV record
2. Insert PARENT get ParentId
3. Insert CHILDREN with ParentId specified
4. If PARENT table has linkage to CHILDREN table as well, you need to make 3rd update query
4. Repeat for all records in CSV file

With this algorithm it is slow to insert a lot of records.

This utility helps to do it, by specifing temporary keys, which then replaced with read ids
when values are received.

1. Read CSV record
2. Fill Structure, add records for each table for one CSV row
4. Repeat for all records in CSV file
5. Exectute insert Function, which do it in 2 passes, make records inserts
and updates references if two tables points to each other.

```javascript

let knx = require('knex');
let {
  insert,
  knexInsert,
  knexUpdate,
  mapper,
  duplicateChecker,
  writeOutput,
  getKey,
  readFull
} = require('./index');

// 0. DECLARE STRUCTURE, keys are table names data to be inserted into
// ===========================
let structure = {
  User: [],
  Phone: [],
};

async function start() {

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
        // this will insert string as is, without quotes
        {name: 'geometry', value: d => () => `geometry::STGeomFromText('POINT (${d.Type} ${d.Type})', 4326)`}
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

    let phone1Key = getKey();
    let phone2Key = getKey();

    // first phone as first record
    if (phones.phone != null) {
      structure.Phone.push({
        id: phone1Key,
        userId: userId,
        phone: phones.phone
      });
    }
    // second phone as second record
    if (phones.phone2 != null) {
      structure.Phone.push({
        id: phone2Key,
        userId: userId,
        phone: phones.phone2
      });
    }

    // first phone is primary phone, this is 2nd path update.
    user.primaryPhone = phone1Key;
  });
  console.log('1 done');

  // 2. VALIDATE DATA, check field unique
  // ===========================
  let dups = duplicateChecker(structure.User, d => d.login);
  // log duplicates to duplicates.json
  await writeOutput("./out/duplicates.json", dups);
  if (dups)
  {
    console.error('validation error');
    return;
  }
  console.log('2 done');

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
      [geometry] geometry,
      [primaryPhone] bigint,
    )
    create table [Phone] (
      id bigint identity,
      [userId] bigint,
      [phone] nvarchar (20),
    ) 
  `);
  console.log('3 done');

  // 4. RUN INSERT PROCESS
  // ===========================
  try {
    await insert(
      knexInsert(knex),
      knexUpdate(knex),
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
    return false;
  }
  finally {
    knex.destroy();
  }
  console.log('4 done');

  return true;
}

```
