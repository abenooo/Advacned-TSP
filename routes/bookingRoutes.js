const express = require('express');
const router = express.Router();

const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controller/bookingController');

// Public or protect as needed
router.get('/', getAllBookings);
router.get('/:id', getBookingById);

// Admin or protect as needed
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
