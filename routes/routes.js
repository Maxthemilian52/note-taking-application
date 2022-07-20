const fs = require('fs');
const path = require('path');
const uuid = require('../helpers/uuid');

//renders notes, notes path
module.exports = app => {
    app.get('/notes', (req, res) => 
        res.sendFile(path.join(__dirname, '../public/notes.html'))
    );
//renders homepage
    app.get('/', (req, res) => 
        res.sendFile(path.join(__dirname, '../public/index.html'))
    );
//reads db.json and declares data as notes variable
    fs.readFile("db/db.json", "utf8", (err, data) => {
       if (err) throw err;
       var notes = JSON.parse(data);

       app.get('/api/notes', function(req, res){
        res.json(notes);
       })
    });
//
    app.post('/api/notes', (req, res) => {
        
        console.info(`${req.method} request received.`);
        
        const { title, text } = req.body;
        if (title && text) {
            const newNote = {
                text,
                title,
                note_id: uuid()
            };

            fs.readFile('db/db.json', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                        const parsedNotes = JSON.parse(data);
                        parsedNotes.push(newNote);

                    fs.writeFile(
                        'db/db.json',
                        JSON.stringify(parsedNotes),
                        (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Succesfully created Note')
                    )
                }
            });

            const response = {
                status: 'success',
                body: 'newNote'
            };

            console.log(response);
            res.status(201).json(response);
            } else {
                res.status(500).json('Error in posting review');
            }
        });

}