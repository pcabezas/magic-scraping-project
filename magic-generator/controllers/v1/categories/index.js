const getCategories = (req, res) => {
  res.json({ value: 'sobre', name: 'pack' })
}

const postCategory = (req, res) => {
  let body = req.body;
  res.json(body);
}

module.exports = {
  getCategories,
  postCategory
}