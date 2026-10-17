import mongoose from 'mongoose';

export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUSES, default: 'Applied' },
    location: { type: String, trim: true, default: '' },
    salary: { type: String, trim: true, default: '' },
    link: { type: String, trim: true, default: '' },
    notes: { type: String, default: '' },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
