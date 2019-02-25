module.exports = (app) => {
  // 404
  app.use((req, res) => {
    res.status(404).render('erro/404', { accountType: '' });
  });

  app.use((err, req, res) => {
    res.status(500).render('erro/500', { accountType: '' });
  });
};
