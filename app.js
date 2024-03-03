const express = require('express');
const app = express();
const port = 3000;

const db = require('./models');
const Restaurant = db.Restaurant;

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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

app.get('/restaurants/new', (req, res) => {
  const form = {
    action: '/restaurants',
    method: 'POST',
    title: '新增餐廳',
    type: 'new',
  };

  return res.render('form', { form });
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

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id;
  const form = {
    action: `/restaurants/${id}?_method=PUT`,
    method: 'POST',
    title: '編輯餐廳',
    type: 'edit',
  };

  return Restaurant.findByPk(id, { raw: true })
    .then((restaurant) => res.render('form', { form, ...restaurant }))
    .catch((err) => console.log(err));
});

app.post('/restaurants', (req, res) => {
  const data = req.body;

  return Restaurant.create({ ...data })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err));
});

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;

  return Restaurant.update({ ...data }, { where: { id } })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
