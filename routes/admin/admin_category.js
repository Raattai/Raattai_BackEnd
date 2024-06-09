var express = require('express');
var router = express.Router();
const flash = require('connect-flash');
var auth = require('../../config/auth');
const Category = require('../../models/category');

// Get Categories index
router.get('/', function(req, res) {
  Category.find()
    .then(categories => {
      res.json({ categories });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Post add-category
router.post('/add-category', function(req, res) {
  const slug = req.body.title.toLowerCase();
  Category.findOne({ slug: slug })
    .then(category => {
      if (category) {
        return res.status(400).json({ message: 'Category slug exists, choose another.' });
      } else {
        var newCategory = new Category({
          name: req.body.title,
          slug: slug
        });

        newCategory.save()
          .then(() => {
            res.json({ message: 'Category added.' });
          })
          .catch(err => {
            console.log("Error saving new category:", err);
            res.status(500).json({ message: 'Error adding category.' });
          });
      }
    })
    .catch(err => {
      console.log("Error finding category:", err);
      res.status(500).json({ message: 'Error checking category existence.' });
    });
});

// Post edit-category
router.post('/edit-category/:id', function(req, res) {
  const id = req.params.id;
  Category.findById(id)
    .then(category => {
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      category.name = req.body.title;
      category.slug = req.body.title.toLowerCase();
      return category.save();
    })
    .then(updatedCategory => {
      res.json({ message: 'Category edited', updatedCategory });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error editing category.' });
    });
});

// Delete category
router.delete('/delete-category/:id', function(req, res) {
  Category.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then(deletedCategory => {
      if (deletedCategory) {
        res.json({ message: 'Category deleted' });
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete category' });
    });
});

// Exports
module.exports = router;
