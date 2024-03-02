const express = require('express');
const app = express();
const port = 3000;

const db = require('./models');
const Restaurant = db.Restaurant;

const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const handlebars = require('handlebars');
handlebars.registerHelper('equal', (arg1, arg2) => {
  return arg1 === arg2;
});

app.get('/', (req, res) => {
  return res.redirect('/restaurants');
});

app.get('/restaurants', async (req, res) => {
  const searchType = req.query.searchType;
  const keyword = req.query.keyword?.trim().toLowerCase();

  try {
    let restaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'category', 'image', 'rating'],
      raw: true,
    });

    if (searchType === 'name') {
      restaurants = restaurants.filter((item) =>
        item.name.toLowerCase().includes(keyword)
      );
    } else if (searchType === 'category') {
      restaurants = restaurants.filter((item) =>
        item.category.toLowerCase().includes(keyword)
      );
    }

    return res.render('index', { restaurants, searchType });
  } catch (error) {
    console.log(error);
  }
});

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id;

  return Restaurant.findByPk(id, {
    attributes: [
      'id',
      'name',
      'category',
      'image',
      'location',
      'phone',
      'google_map',
      'description',
    ],
    raw: true,
  })
    .then((restaurant) => res.render('restaurant', { restaurant }))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
