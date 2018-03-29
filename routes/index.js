module.exports = function(app, dbs) {

    app.get('/messages', (req, res) => {
      dbs.production.collection('messages').find({  }).sort({ createdAt:-1 }).toArray((err, docs) => {
        if (err) {
          console.log(err)
          res.error(err)
        } else {
          console.info('message page');
          res.json(docs)
        }
      })
    });
  
    app.post('/add', (req, res) => {
        console.info('req body', req.body);
        let message = req.body;
        let s = 0;
        for ( let i = 0; i < message.length; i++ ) {
      
          const el = {
            text: message[i].text,
            user: message[i].user,
            createdAt: new Date(),
          }

          dbs.production.collection('messages').insertOne(el, (err, res) => {
            if (err) throw err;
            console.log('inserted one document');
            // dbs.close(); 
          });
          res.sendStatus(200);
        }

    });

    return app
}