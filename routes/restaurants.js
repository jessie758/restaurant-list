const express = require('express');
const router = express.Router();

const db = require('../models');
const Restaurant = db.Restaurant;

router.get('/', async (req, res) => {
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

router.get('/new', (req, res) => {
  const form = {
    action: '/restaurants',
    method: 'POST',
    title: '新增餐廳',
    type: 'new',
  };

  return res.render('form', { form });
});

router.get('/:id', (req, res) => {
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

router.get('/:id/edit', (req, res) => {
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

router.post('/', (req, res) => {
  const data = req.body;

  return Restaurant.create({ ...data })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err));
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;

  return Restaurant.update({ ...data }, { where: { id } })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((err) => console.log(err));
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect(`/restaurants`))
    .catch((err) => console.log(err));
});

module.exports = router;
