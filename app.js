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

app.get('/', (req, res) => {
  return res.redirect('/restaurants');
});

app.get('/restaurants', (req, res) => {
  return Restaurant.findAll({
    attributes: [
      'id',
      'name',
      'name_en',
      'category',
      'image',
      'location',
      'phone',
      'google_map',
      'rating',
      'description',
    ],
    raw: true,
  })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((err) => console.log(err));
});

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id;

  return Restaurant.findByPk(id, {
    attributes: [
      'id',
      'name',
      'name_en',
      'category',
      'image',
      'location',
      'phone',
      'google_map',
      'rating',
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
