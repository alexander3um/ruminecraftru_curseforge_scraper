const cloudscraper = require('cloudscraper');
const knex = require('knex');

const knexConnection = knex({
  client: `mysql2`,
  connection: {
    host: ``,
    user: ``,
    password: ``,
    database: ``
  }
});

let counter = 0;

function iterate() {

  function subIterate(rows, subOffset = 0) {

    if (subOffset < rows.length) {
      return cloudscraper.get(rows[subOffset].cursehref).then(result => {
        const id = result.match(/href="\/project\/([0-9]+)\/license"/i);
        knexConnection('dle_post')
          .where('id', rows[subOffset].id)
          .update(`curseID`, id[1])
          .then(result => {
            console.log(`Updated: ${counter}, current id: ${id[1]}`);
            counter++;
            subIterate(rows, ++subOffset);
          })
      }).catch(error => {
        if (error.statusCode !== 404) {
          throw new Error('Me ded, sir. Me is sorri.');
        }
        console.log(`Whoops, this link is gay: ${rows[subOffset].cursehref}`);
        subIterate(rows, ++subOffset);
      });
    }
    iterate();

  }

  knexConnection(`dle_post`)
    .select(['id', 'cursehref', 'curseID'])
    .where('cursehref', 'LIKE', 'https%')
    .whereNull('curseID')
    .limit(5000)
    .then(result => {
      console.log(`Fetched ${result.length} posts. Let's get started:`);
      subIterate(result);
    });

}

iterate();