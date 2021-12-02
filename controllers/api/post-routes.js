const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');

// get all posts
router.get('/', (req, res) => {
  Post.findAll({
    order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
    ],
    // include all user comments
    include: [
    {
     model: Comment,
     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
     // nested include comment's user
     include: {
       model: User,
       attributes: ['username']
     }
   },
   // include post's user
   {
     model: User,
     attributes: ['username']
   }
 ]
})
    .then(dbPostData => res.json(dbPostData))
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get post by ID
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
    ],
    // include post's comments
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        // nested include comment's user
        include: {
          model: User,
          attributes: ['username']
        }
      },
      // include post's user
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // if no data, not found err
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this ID' });
        return;
      }
      res.json(dbPostData);
    })
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// post post
router.post('/', (req, res) => {
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update post by ID
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      // if no data, not found err
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this ID' });
        return;
      }
      res.json(dbPostData);
    })
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete post by ID
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      // if no data, not found err
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this ID' });
        return;
      }
      res.json(dbPostData);
    })
    // internal server error
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
