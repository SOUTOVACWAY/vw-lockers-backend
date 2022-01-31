const router = require('express').Router();

router.use('/login', require('./login'));
router.use('/users', require('./users'));
router.use('/incidences', require('./incidences'));
router.use('/machines', require('./machines'));
router.use('/contracts', require('./contracts'));
router.use('/sales', require('./sales'));
router.use('/customers', require('./customers'));
router.use('/reports', require('./reports'));
router.use('/remoteactions', require('./remoteactions'));
router.use('/updates', require('./updates'));
router.use('/shipments', require('./shipments'));
router.use('/audit', require('./audit'));
router.use('/shift', require('./shift'));
router.use('/promotersales', require('./promotersales'));

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      message: err.message,
      fields: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
