const { dockStart } = require('@nlpjs/basic');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const PORT = 3000;

(async () => {
  //
  // NLP STUFF
  //
  const dock = await dockStart({ use: ['Basic']});
  const nlp = dock.get('nlp');
  await nlp.addCorpus('./corpus.json');
  await nlp.train();

  //
  // EXPRESS SERVER
  //
  // Middleware to parse JSON request bodies
  app.use(bodyParser.json());
  app.use(cors());

  // Define a POST endpoint to create a new response
  app.post('/bot', async (req, res) => {
    const msg = req.body.msg;
    const response = await nlp.process('en', msg);
    //console.log(response);
    res.status(201).json(response);
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
