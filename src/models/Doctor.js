const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: Number },
  college: { type: String }, // For backward compatibility with mapped_data
  training: { type: String }
});

const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  treatments: [String]
});

const workExperienceSchema = new mongoose.Schema({
  organization: { type: String, required: true },
  role: { type: String, required: true },
  from_year: { type: String },
  to_year: { type: String },
  current: { type: Boolean, default: false }
});

const testimonialSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  feedback: { type: String, required: true }
});

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  
  // Display name (optional, can be derived)
  name: { type: String }, 
  
  designation: { type: String, required: true },
  experienceYears: { type: Number },
  experience: { type: String }, // For backward compatibility with mapped_data (e.g. "42 Years")
  
  hospitalId: { type: String },
  hospital: { type: String }, // Hospital name as string
  departmentId: { type: String },
  cityId: { type: String },
  city: { type: String },
  
  proceduresPerformed: { type: Number },
  procedures_performed: { type: Number }, // For backward compatibility
  
  image: { type: String },
  video_url: { type: String },
  
  bio: { type: String },
  description: { type: String }, // For backward compatibility
  
  qualifications: [qualificationSchema],
  education: [qualificationSchema], // For backward compatibility
  
  specializations: [String],
  specializationDetails: [specializationSchema],
  
  treatments: [String],
  
  workExperience: [workExperienceSchema],
  work_experience: [workExperienceSchema], // For backward compatibility
  
  achievements: [String],
  awards: [String], // For backward compatibility
  
  languagesSpoken: [String],
  testimonials: [testimonialSchema],
  
  // SEO Fields
  metaTitle: { type: String },
  metaDescription: { type: String },
  keywords: [String],
  focusKeyword: { type: String },
  canonical: { type: String },
  
  // Schema/JSON-LD
  schemaType: { type: String, default: 'Physician' },
  schemaData: { type: mongoose.Schema.Types.Mixed },

  status: { type: String, enum: ['draft', 'published', 'unpublished'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Pre-save hook to generate 'name' and 'slug' if needed
doctorSchema.pre('save', function(next) {
  if (this.isModified('firstName') || this.isModified('lastName') || !this.name) {
    this.name = `${this.firstName} ${this.lastName}`.trim();
  }
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
