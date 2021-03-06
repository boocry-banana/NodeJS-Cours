let users = require('../models/users');
let sha1 = require('../utils/sha1');

// GET /
exports.getAllUsers = (req, resp) => {
    users.find({}, (err, data) => {
        resp.json(extractData(err, data));
    });
}

// GET /:id
//api/users
exports.getUserById = (req, resp) => {
    console.log(`ID: ${req.params.id}`);
    users.findById(req.params.id, (err, data) => {
        resp.json(extractData(err, data));
    });
}

//POST /
exports.createUser = (req, resp) => {
    let obj = new users(req.body);
    let regexp = /^.*(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]){6,}.*$/; // Contient chiffre minuscule majuscule pas de caractère spéciaux et minimun 6 caractères
    const login = obj.login;
    console.log(req.body);
    console.log(obj.password);
    console.log(regexp.test(obj.password));
    if(regexp.test(obj.password)){
        obj.password = sha1(obj.password);
        
        obj.save((err, data) => resp.json(extractData(err, data)));
    }
    else{
        resp.status(400).json({ succes: "failed", message: "password failed" });
    }
}

// PUT /:id
exports.updateUser = (req, resp) => {
    users.findByIdAndUpdate(req.params.id, req.body, { new: false }, (err, data) => resp.json(extractData(err, data)));
}

//DELETE /:id
exports.deleteUser = (req, resp) => {
    users.remove({ _id: req.params.id }, (err, data) => {
        if (err)
            resp.json(err);
        resp.json({ 'message': 'User successfully deleted' });
    })
}

function extractData(err, data) {
    if (err)
        return err;
    return data;
}
