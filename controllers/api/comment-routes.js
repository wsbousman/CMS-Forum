const router = require('express').Router();
const { Comment } = require('../../models');

// get all comments
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: [
          'id',
          'user_id',
          'comment_text',
          'created_at',
        ],
        order: [['created_at', 'DESC']],
      })
        .then(dbPostData => res.json(dbPostData))
        // internal server error
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

// post comment
router.post('/', (req, res) => {
      if (req.session) {
        Comment.create({
          comment_text: req.body.comment_text,
          post_id: req.body.post_id,
          user_id: req.session.user_id
        })
          .then(dbCommentData => res.json(dbCommentData))
          // bad request
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      }
    });

// delete comment by id
router.delete('/:id', (req, res) => {
    Comment.destroy({
      where: {
        id: req.params.id
      }
    })
      // if no data, not found err
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No comment found with this ID' });
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