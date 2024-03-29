const express = require('express');
const router = express.Router();

const db = require('../models');
const Restaurant = db.Restaurant;

const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searchType = req.query.searchType;
    const keyword = req.query.keyword?.trim().toLowerCase();
    const sort = req.query.sort;
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const condition = { userId: userId };
    const order = [];

    switch (searchType) {
      case 'name':
        condition.name = { [Op.like]: `%${keyword}%` };
        break;
      case 'category':
        condition.category = { [Op.like]: `%${keyword}%` };
        break;
    }

    switch (sort) {
      case 'asc':
        order.push(['name', 'ASC']);
        break;
      case 'desc':
        order.push(['name', 'DESC']);
        break;
      case 'category':
        order.push(['category', 'ASC']);
        break;
      case 'location':
        order.push(['location', 'ASC']);
        break;
    }

    const { count, rows } = await Restaurant.findAndCountAll({
      attributes: ['id', 'name', 'category', 'image', 'rating'],
      order: order,
      where: condition,
      offset: (page - 1) * limit,
      limit,
      raw: true,
    });
    const pages = Math.ceil(count / limit);

    return res.render('index', {
      restaurants: rows,
      sort,
      searchType,
      keyword,
      page,
      pages,
    });
  } catch (error) {
    error.errorMessage = '無法瀏覽餐廳清單！';
    next(error);
  }
});

router.get('/new', (req, res, next) => {
  try {
    return res.render('create-restaurant');
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

    const restaurant = await Restaurant.findByPk(id, { raw: true });
    return res.render('edit-restaurant', { ...restaurant });
  } catch (error) {
    error.errorMessage = '發生錯誤，無法修改餐廳！';
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const isValid = verifyData(data);
    if (!isValid) {
      req.flash('error', '請輸入正確的餐廳資料！');
      return res.redirect('back');
    }

    await Restaurant.create({ userId, ...data });
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
    const userId = req.user.id;
    const data = req.body;

    const isValid = verifyData(data);
    if (!isValid) {
      req.flash('error', '請輸入正確的餐廳資料！');
      return res.redirect('back');
    }

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      req.flash('error', '此筆餐廳資料不存在！');
      return res.redirect('back');
    }
    if (userId !== restaurant.userId) {
      req.flash('error', '修改權限不足！');
      return res.redirect('back');
    }

    await restaurant.update({ ...data });
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

function verifyData(data) {
  for (let key in data) {
    switch (key) {
      case 'name':
        if (!data[key] || typeof data[key] !== 'string') return false;
        break;
      case 'rating':
        if (
          isNaN(Number(data[key])) ||
          Number(data[key]) < 1 ||
          Number(data[key]) > 5
        )
          return false;
        break;
      default:
        if (typeof data[key] !== 'string') return false;
        break;
    }
  }

  return true;
}

module.exports = router;
