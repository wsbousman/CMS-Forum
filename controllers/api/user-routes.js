const router = require('express').Router();
const { User, Post } = require('../../models');

// get all users
router.get('/', (req, res) => {
  User.findAll({
    // do not display password
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// find user by ID
router.get('/:id', (req, res) => {
  User.findOne({
    // do not display password
    attributes: { exclude: ['password'] },
    where: {
    id: req.params.id
    },
    // include all of user's posts
    include: [
    {
      model: Post,
      attributes: ['id', 'title', 'post_url', 'created_at']
    },
    // include all of user's comments
    {
      model: Comment,
      attributes: ['id', 'comment_text', 'created_at'],
      include: {
        model: Post,
        attributes: ['title']
      }
    }
  ]
}).then(dbUserData => {
      // if no data, not found err
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID' });
        return;
      }
      res.json(dbUserData);
    })
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// create user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  // begin session
  .then(dbUserData => {
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
  
      res.json(dbUserData);
    });
  })
  // internal server error
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login user
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    // if no data, not found err
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    // begin session
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

// update user by ID
router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      // if no data, not found err
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this ID' });
        return;
      }
      res.json(dbUserData);
    })
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete user by ID
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      // if no data, not found err
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// logout user
router.post('/logout', (req, res) => {
  // if session, destroy instance 
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      // no content
      res.status(204).end();
    });
  }
  // if !session , not found err
  else {
    res.status(404).end();
  }
});

module.exports = router;
