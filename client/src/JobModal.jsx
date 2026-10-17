import { useEffect, useState } from 'react';
import { STATUSES } from './constants.js';

const normalizeDateValue = (value) => {
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
};

export default function JobModal({ job, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    location: '',
    salary: '',
    link: '',
    notes: '',
    ...job,
    appliedDate: normalizeDateValue(job.appliedDate),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h2>{job._id ? 'Edit application' : 'Add application'}</h2>
        <div className="grid2">
          <label>
            Company
            <input value={form.company} onChange={set('company')} required autoFocus />
          </label>
          <label>
            Role
            <input value={form.role} onChange={set('role')} required />
          </label>
          <label>
            Status
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Applied on
            <input type="date" value={form.appliedDate} onChange={set('appliedDate')} />
          </label>
          <label>
            Location
            <input value={form.location} onChange={set('location')} />
          </label>
          <label>
            Salary
            <input value={form.salary} onChange={set('salary')} placeholder="e.g. 6 LPA" />
          </label>
        </div>
        <label>
          Job link
          <input type="url" value={form.link} onChange={set('link')} placeholder="https://" />
        </label>
        <label>
          Notes
          <textarea value={form.notes} onChange={set('notes')} />
        </label>
        {error && <p className="err">{error}</p>}
        <div className="actions">
          {job._id && (
            <button
              type="button"
              className="btn danger"
              onClick={() => window.confirm('Delete this application?') && onDelete(job._id)}
            >
              Delete
            </button>
          )}
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
