const Doctor = require('../models/Doctor');
const slugify = require('slugify');

const mapLegacyFields = (data) => {
  if (data.qualifications) data.education = data.qualifications;
  if (data.workExperience) data.work_experience = data.workExperience;
  if (data.experienceYears !== undefined) data.experience = `${data.experienceYears} Years`;
  if (data.bio) data.description = data.bio;
  if (data.achievements) data.awards = data.achievements;
  if (data.proceduresPerformed !== undefined) data.procedures_performed = data.proceduresPerformed;
  return data;
};

exports.createDoctor = async (req, res) => {
  try {
    let { firstName, lastName, slug } = req.body;
    if (!slug) {
      slug = slugify(`${firstName}-${lastName}`, { lower: true, strict: true });
    }
    
    // Map legacy fields for backward compatibility
    req.body = mapLegacyFields(req.body);
    
    const doctor = new Doctor({ ...req.body, slug, createdBy: req.user._id });
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Doctor.countDocuments(filter);
    const doctors = await Doctor.find(filter)
      .sort({ lastName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      data: doctors,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorBySlug = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ slug: req.params.slug });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    // Map legacy fields for backward compatibility
    req.body = mapLegacyFields(req.body);
    
    if (req.body.firstName !== undefined || req.body.lastName !== undefined) {
      const currentFirstName = req.body.firstName !== undefined ? req.body.firstName : doctor.firstName;
      const currentLastName = req.body.lastName !== undefined ? req.body.lastName : doctor.lastName;
      req.body.name = `${currentFirstName || ''} ${currentLastName || ''}`.trim();
    }
    
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
