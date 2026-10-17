import { Router } from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

const FIELDS = ['company', 'role', 'status', 'location', 'salary', 'link', 'notes', 'appliedDate'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));
const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(escapeRx(String(req.query.q)), 'i');
    filter.$or = [{ company: rx }, { role: rx }];
  }
  res.json(await Job.find(filter).sort({ updatedAt: -1 }));
});

router.post('/', async (req, res) => {
  if (!req.body.company || !req.body.role) return res.status(400).json({ message: 'Company and role are required' });
  res.status(201).json(await Job.create({ ...pick(req.body), user: req.userId }));
});

router.put('/:id', async (req, res) => {
  const job = await Job.findOneAndUpdate({ _id: req.params.id, user: req.userId }, pick(req.body), {
    new: true,
    runValidators: true,
  });
  if (!job) return res.status(404).json({ message: 'Application not found' });
  res.json(job);
});

router.delete('/:id', async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!job) return res.status(404).json({ message: 'Application not found' });
  res.status(204).end();
});

export default router;
