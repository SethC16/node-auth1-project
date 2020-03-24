const bcrypt = require('bcryptjs');
const router = require('express').Router();
const Users = require('../users/users-model');

router.post('/register', (req, res) => {
    const userInfo = req.body;

    const rounds = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, rounds);

    userInfo.password = hash;

    Users.add(userInfo)
        .then(user => {
            res.json(user);
        })
        .catch(error => res.json(error))
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.findBy({username})
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                };
                res.status(200).json({ hello: user.username })
            } else {
                res.status(401).json({ message: 'invalid credentials given.'})
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: 'error finding the user', error})
        })
});

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({ message: "you were unable to logout", error})
            } else {
                res.status(200).json({ message: 'Logout was successful.'})
            }
        });
    } else {
        res.status(200).json({ message: 'already logged out'})
    }
})


module.exports = router;