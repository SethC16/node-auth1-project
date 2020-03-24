const router = require('express').Router();
const Users = require('./users-model');

router.get('/', (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(error => res.json(error));
})

module.exports = router;
