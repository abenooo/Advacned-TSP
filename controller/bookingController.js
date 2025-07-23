const Booking = require('../models/ Booking'); // Note: filename has a space, fix if needed

// Get all bookings
exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('serviceId', 'name')
    .populate('handledBy', 'name email');
  res.json(bookings);
};

// Get one booking by ID
exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('serviceId', 'name')
    .populate('handledBy', 'name email');
  if (!booking) return res.status(404).json({ message: 'Not found' });
  res.json(booking);
};

// Create a booking
exports.createBooking = async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.status(201).json(booking);
};

// Update a booking
exports.updateBooking = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!booking) return res.status(404).json({ message: 'Not found' });
  res.json(booking);
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
