var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
const Category = require('../models/category'); // Import the Category model

router.get('/category', function(req, res) {
  Category.find({}, function(err, categories) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ categories });
  });
});


// Post add-category
router.post('/add-category', [
  check('title', 'Title must not be empty').not().isEmpty()
], function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, send JSON response with error messages
    return res.status(400).json({ errors: errors.array() });
  } else {
    const slug = req.body.title.toLowerCase(); 
       Category.findOne({ slug: slug })
      .then(category => {
        if (category) {
          return res.status(400).json({ error: 'Category slug exists, choose another.' });
        } else {
          var newCategory = new Category({
            title: req.body.title,
            slug: slug 
          });

          newCategory.save()
            .then(() => {
              Category.find({}).exec()
                .then(categories => {
                  res.app.locals.categories = categories;
                  return res.status(200).json({ success: 'Category added.' });
                })
                .catch(err => {
                  console.error(err);
                  return res.status(500).json({ error: 'Internal Server Error' });
                });
            })
            .catch(err => {
              console.error(err);
              return res.status(500).json({ error: 'Error adding category.' });
            });
        }
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: 'Error checking category existence.' });
      });
  }
});

// Get edit category
router.get('/edit-category/:id',  function(req, res) {
  Category.findById(req.params.id)
    .then(category => {
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(200).json({ title: category.title, id: category._id });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Post edit-category
router.post('/edit-category/:id',  [
  check('title', 'Title must not be empty').not().isEmpty()
], function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const id = req.params.id;

    Category.findById(id)
      .then(category => {
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }

        category.title = req.body.title;
        category.slug = req.body.title.toLowerCase();

        return category.save();
      })
      .then(updatedCategory => {
        Category.find({}).exec()
          .then(categories => {
            res.app.locals.categories = categories;
            return res.status(200).json({ success: 'Category edited' });
          })
          .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: 'Error editing category.' });
      });
  }
});


// Delete Page
router.get('/delete-category/:id',  function(req, res) {
  Category.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then(deletedcategory => {
      if (deletedcategory) {
        Category.find({}).exec()
          .then(categories => {
            res.app.locals.categories = categories;
            return res.status(200).json({ success: 'Category deleted' });
          })
          .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          });
      } else {
        return res.status(404).json({ error: 'Category not found' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete category' });
    });
});

// Exports
module.exports = router;
