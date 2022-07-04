const express = require('express');
const router = express.Router();

const tripDetailsController = require('../controllers/tripDetails.controller');
const currencyController = require('../controllers/currencyDetails.controller');
const bookingController = require('../controllers/booking.controller');

router.post('/getTripDetails', tripDetailsController.fetchTripDetails);
router.post('/getCurrencyList', currencyController.fetchCurrencyList);
router.post('/addBooking', bookingController.bookTrip);
router.post('/requestCallBack', bookingController.requestCallBack);


module.exports = router;