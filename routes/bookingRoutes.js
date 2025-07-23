const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controller/bookingController');

// Public
router.post('/', createBooking);

// Protected
router.get('/', auth, getAllBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id', auth, updateBooking);
router.delete('/:id', auth, deleteBooking);

module.exports = router;
