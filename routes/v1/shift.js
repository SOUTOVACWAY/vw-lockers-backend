const mongoose = require('mongoose');
const router = require('express').Router();
const Machine = mongoose.model('Machine');
const ShiftEntry = mongoose.model('ShiftEntry');
const auth = require('../auth');
const asyncHandler = require('express-async-handler')

router.get('/', auth.required, (req, res, next) => {
    let filter = {}
  
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      let endDate = new Date(req.query.endDate);
      endDate.setDate(endDate.getDate() + 1);
  
      filter.date = {$gte: startDate, $lte: endDate };
    }
  
    if (req.query.machine) {
      filter.machine = req.query.machine;
    }
  
    ShiftEntry.find(filter)
      .sort({date: 'desc'})
      .populate('machine', 'serial')
      .then(shiftEntries => {
        return res.json(shiftEntries);
      })
      .catch(next);
  });

router.post('/', asyncHandler(async (req, res, next) => {
  const token = auth.getToken(req)

  let machine = await Machine.findOne({ token: token }).exec()
  if (!machine) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  const shiftEntry = new ShiftEntry(req.body);

  if (shiftEntry.action === 'START') {
    machine.shift_active = true;
  } else {
    machine.shift_active = false;
  }

  await shiftEntry.save();
  await machine.save();

  return res.json(shiftEntry);
}));

module.exports = router;
