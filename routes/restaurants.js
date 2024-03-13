const express = require('express');
const router = express.Router();

const db = require('../models');
const Restaurant = db.Restaurant;

router.get('/', async (req, res, next) => {
  try {
    const searchType = req.query.searchType;
    const keyword = req.query.keyword?.trim().toLowerCase();

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
    error.errorMessage = '無法瀏覽餐廳清單！';
    next(error);
  }
});

router.get('/new', (req, res, next) => {
  try {
    const form = {
      action: '/restaurants',
      method: 'POST',
      title: '新增餐廳',
      type: 'new',
    };

    return res.render('form', { form });
  } catch (error) {
    error.errorMessage = '發生錯誤，無法新增餐廳！';
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const restaurant = await Restaurant.findByPk(id, {
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
    });
    return res.render('restaurant', { restaurant });
  } catch (error) {
    error.errorMessage = '無法取得餐廳資料！';
    next(error);
  }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const id = req.params.id;
    const form = {
      action: `/restaurants/${id}?_method=PUT`,
      method: 'POST',
      title: '編輯餐廳',
      type: 'edit',
    };

    const restaurant = await Restaurant.findByPk(id, { raw: true });
    return res.render('form', { form, ...restaurant });
  } catch (error) {
    error.errorMessage = '發生錯誤，無法修改餐廳！';
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;

    await Restaurant.create({ ...data });
    req.flash('success', '新增成功！');
    return res.redirect('/restaurants');
  } catch (error) {
    error.errorMessage = '新增失敗！';
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    await Restaurant.update({ ...data }, { where: { id } });
    req.flash('success', '修改成功！');
    return res.redirect(`/restaurants/${id}`);
  } catch (error) {
    error.errorMessage = '修改失敗！';
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await Restaurant.destroy({ where: { id } });
    req.flash('success', '刪除成功！');
    return res.redirect(`/restaurants`);
  } catch (error) {
    error.errorMessage = '刪除失敗！';
    next(error);
  }
});

module.exports = router;
