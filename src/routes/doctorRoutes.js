const express = require('express');
const router = express.Router();
const { 
  createDoctor, 
  getDoctors, 
  getDoctorBySlug, 
  getDoctorById, 
  updateDoctor, 
  deleteDoctor 
} = require('../controllers/doctorController');
const { protect, adminOrEditor, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDoctors)
  .post(protect, adminOrEditor, createDoctor);

router.route('/:slug').get(getDoctorBySlug);

router.route('/id/:id').get(getDoctorById);

router.route('/:id')
  .put(protect, adminOrEditor, updateDoctor)
  .delete(protect, adminOnly, deleteDoctor);

module.exports = router;
