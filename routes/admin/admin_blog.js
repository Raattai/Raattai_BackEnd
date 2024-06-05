var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
var auth = require('../../config/auth');
var isAdmin = auth.isAdmin;

// Get Blog model
var Blog = require('../../models/blog.js'); // Assuming correct path and filename

router.get('/', function(req, res) {
  Blog.find({}).sort({ sorting: 1 }).exec() // Remove the callback function from exec()
    .then(blogs => {
      res.json({ blogs });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// Get add Blog
router.get('/add-blog', function(req, res) {
  var Blogtitle = "";
  var slug = "";
  var content = "";

  res.render('admin/add_Blog', {
    Blogtitle: Blogtitle,
    slug: slug,
    content: content
  });
});

// Post add-Blog
router.post('/add-blog', [
  check('Blogtitle', 'BlogTitle must not be empty').not().isEmpty()
], function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, render the form again with error messages
    res.render('admin/add_Blog', {
      errors: errors.array(),
      Blogtitle: req.body.Blogtitle,
      slug: req.body.slug,
      content: req.body.content
    });
  } else {
    // If validation passes, proceed with your logic
    Blog.findOne({ slug: req.body.slug })
      .then(Blog => {
        if (Blog) {
          req.flash('danger', 'Blog slug exists, choose another.');
          res.redirect('/admin/Blogs'); // Assuming a redirect to the Blogs route
        } else {
          var newBlog = new Blog({
            Blogtitle: req.body.Blogtitle,
            slug: req.body.slug,
            content: req.body.content,
            sorting: 100
          });

          newBlog.save()
            .then(() => {
              Blog.find({}).sort({ sorting: 1 }).exec() // Remove the callback function from exec()
              .then(Blogs => {
                res.app.locals.Blogs =Blogs;
               })
              .catch(err => {
                  console.error(err);
                    res.status(500).send('Internal Server Error');
                  });

              req.flash('success', 'Blog added.');
              res.redirect('/admin/Blogs'); // Assuming a redirect to the Blogs route
            })
            .catch(err => {
              console.log("Error:", err);
              req.flash('danger', 'Error adding Blog.');
              res.redirect('/admin/Blogs'); // Assuming a redirect to the Blogs route
            });
        }
      })
      .catch(err => {
        console.log("Error:", err);
        req.flash('danger', 'Error checking Blog existence.');
        res.redirect('/admin/Blogs'); // Assuming a redirect to the Blogs route
      });
  }
});



//Post Recoder Blogs
router.post('/reorder-Blogs', async function(req, res) {
  var ids = req.body['id[]'];

  try {
      for (let index = 0; index < ids.length; index++) {
          const id = ids[index];
          const blog = await Blog.findById(id);
          blog.sorting = index + 1;
          await blog.save();
      }
      Blog.find({}).sort({ sorting: 1 }).exec() // Remove the callback function from exec()
        .then(Blogs => {
          res.app.locals.Blogs =Blogs;
         })
        .catch(err => {
            console.error(err);
              res.status(500).send('Internal Server Error');
            });
      console.log('Blogs reordered successfully.');
      res.sendStatus(200); // Send success response
  } catch (error) {
      console.error('Error reordering Blogs:', error);
      res.status(500).send('Internal Server Error'); // Send error response
  }
});


// Get edit Blog
router.get('/edit-Blog/:slug', function(req, res) {
  Blog.findOne({slug: req.params.slug})
    .then(blog => {
      if (!blog) {
        // Handle the case where no Blog with the given slug is found
        return res.status(404).send("Blog not found");
      }

      res.render('admin/edit_Blog', {
        Blogtitle: blog.Blogtitle,
        slug: blog.slug,
        content: blog.content,
        id: blog._id
      });
    })
    .catch(err => {
      // Handle errors
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// Post edit-Blog
router.post('/edit-Blog/:slug', [
  check('Blogtitle', 'BlogTitle must not be empty').not().isEmpty(),
  check('content', 'Content must not be empty').not().isEmpty(),
], function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, render the form again with error messages
    res.render('admin/edit_Blog', {
      errors: errors.array(),
      Blogtitle: req.body.Blogtitle,
      slug: req.body.slug,
      content: req.body.content,
      id: req.body.id // Define id from the request body,
      
    });
  } else {
    // If validation passes, proceed with your logic
    const id = req.body.id; // Define id from the request body
    Blog.findOne({ slug: req.body.slug, _id: { '$ne': id } })
      .then(blog => {
        if (blog) {
          req.flash('danger', 'blog slug exists, choose another.');
          res.redirect('/admin/blogs/edit-blog/' + req.body.slug); // Redirect back to the edit blog with the slug
        } else {
          return blog.findById(id); // Find the blog by ID
        }
      })
      .then(blog => {
        if (!blog) {
          // Handle the case where no blog with the given ID is found
          return res.status(404).send("blog not found");
        }
      
        // Update blog properties
        blog.Blogtitle = req.body.Blogtitle;
        blog.slug = req.body.slug;
        blog.content = req.body.content;
        Blog.find({}).sort({ sorting: 1 }).exec() // Remove the callback function from exec()
        .then(blogs => {
          res.app.locals.Blogs =blogs;
         })
        .catch(err => {
            console.error(err);
              res.status(500).send('Internal Server Error');
            });
        // Save the updated Blog
        return blog.save()
          .then(updatedBlog => {
            // Redirect to the admin Blogs route after successfully updating the Blog
            req.flash('success', 'Blog edited');
            res.redirect('/admin/Blogs/edit-Blog/' + updatedBlog.slug); // Redirect to the edit Blog
          });
      })
      .catch(err => {
        // Handle errors
        console.error(err);
        req.flash('danger', 'Error editing Blog.');
        res.redirect('/admin/Blogs');
      });
  }
});


// Delete Blog
router.get('/delete-Blog/:id', function(req, res) {
  Blog.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then(deletedBlog => {
      if (deletedBlog) {
        Blog.find({}).sort({ sorting: 1 }).exec() // Remove the callback function from exec()
        .then(Blogs => {
          res.app.locals.Blogs =Blogs;
         })
        .catch(err => {
            console.error(err);
              res.status(500).send('Internal Server Error');
            });
        req.flash('success', 'Blog deleted');
      } else {
        req.flash('error', 'Blog not found');
      }
      res.redirect('/admin/Blogs');
    })
    .catch(err => {
      console.error(err);
      req.flash('error', 'Failed to delete Blog');
      res.redirect('/admin/Blogs');
    });
});


// Exports
module.exports = router;
