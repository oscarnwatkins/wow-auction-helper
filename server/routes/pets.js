const express = require('express'),
  router = express.Router()
AWS = require('aws-sdk'),
  url = require('url'),
  secrets = require('../secrets/secrets');


// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

router.get('/:id', (req, res) => {
  res.setHeader('content-type', 'application/json');

  try {
    connection = startConnection();
    connection.query('SELECT * from pets where speciesId = ' + req.params.id, function (err, rows, fields) {
      res.setHeader('content-type', 'application/json');
      try {
        if (!err && rows.length > 0) {
          connection.end();
          res.json(rows[0]);
        } else {
          request.get(`https://eu.api.battle.net/wow/pet/species/${req.params.id}?locale=en_GB&apikey=${secrets.apikey}`, (err, re, body) => {
            const pet = reducePet(body),
              query = `
              INSERT INTO pets (speciesId, petTypeId, creatureId,
                name, icon, description, source)
                VALUES (
                  ${ pet.speciesId},
                  ${ pet.petTypeId},
                  ${ pet.creatureId},
                  "${ safeifyString(pet.name)}",
                  "${ pet.icon}",
                  "${ safeifyString(pet.description)}",
                  "${ safeifyString(pet.source)}");`;

            res.json(pet);
            console.log(`Adding new pet to the DB: ${req.params.id}`, query);

            connection.query(query,
              (err, rows, fields) => {
                if (err) {
                  console.error(`Could not add the species with the id ${req.params.id}`, err.sqlMessage);
                } else {
                  console.log(`Successfully added pet with speciesID ${req.params.id}`);
                }
              });
            connection.end();
          });
        }
      } catch (e) {
        console.error(`Could not get the pet with the speciesID ${req.params.id}`, e);
        connection.end();
        res.json({});
      }
    });
  } catch (err) {
    res.json({});
    console.error(err);
  }
});

router.patch('/:id', (req, res) => {
  res.setHeader('content-type', 'application/json');
  request.get(`https://eu.api.battle.net/wow/pet/species/${req.params.id}?locale=en_GB&apikey=${secrets.apikey}`, (err, re, body) => {
    const pet = reducePet(body),
      query = `
        UPDATE pets 
          SET
            petTypeId = ${ pet.petTypeId},
            creatureId = ${ pet.creatureId},
            name = "${ safeifyString(pet.name)}",
            icon = "${ pet.icon}",
            description = "${ safeifyString(pet.description)}",
            source = "${ safeifyString(pet.source)}"
          WHERE speciesId = ${ pet.speciesId };`;

    res.json(pet);
    console.log(`Updating pet with speciesID: ${req.params.id}`, query);

    connection.query(query,
      (err, rows, fields) => {
        if (err) {
          console.error(`Could not update the pet with the speciesId ${req.params.id}`, err.sqlMessage);
        } else {
          console.log(`Successfully updated pet with speciesId ${req.params.id}`);
        }
      });
    connection.end();
  });
});

router.get('*', (req, res) => {
  res.setHeader('content-type', 'application/json');
  // Get all pets
  connection = startConnection();
  connection.query('SELECT * from pets', function (err, rows, fields) {
    connection.end();
    res.setHeader('content-type', 'application/json');
    if (!err) {
      res.json({
        'pets': rows
      });
    } else {
      console.log('The following error occured while querying DB:', err);
    }
  });
});

function reducePet(pet) {
  pet = JSON.parse(pet);
  return {
    speciesId: pet.speciesId,
    petTypeId: pet.petTypeId,
    creatureId: pet.creatureId,
    name: pet.name,
    canBattle: pet.canBattle,
    icon: pet.icon,
    description: pet.description,
    source: pet.source
  };
}

function safeifyString(str) {
  return str.replace(/[\']/g, '\'').replace(/[\"]/g, '\\"').replace(/\\\\\"/g, '\\\\\\"');
}

function startConnection() {
  return mysql.createConnection(secrets.databaseConn);
}

function forceStopIfTest(error) {
  if (inTesting) {
    throw error;
  }
}

module.exports = router;