import { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import { STATUSES } from './constants.js';
import JobModal from './JobModal.jsx';

const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export default function Dashboard({ user, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, job = edit
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState('');

  useEffect(() => {
    api.listJobs().then(setJobs).catch((e) => setError(e.message));
  }, []);

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? jobs.filter((j) => j.company.toLowerCase().includes(s) || j.role.toLowerCase().includes(s)) : jobs;
  }, [jobs, q]);

  const save = async (data) => {
    try {
      const saved = data._id ? await api.updateJob(data._id, data) : await api.createJob(data);
      setJobs((js) => (data._id ? js.map((j) => (j._id === saved._id ? saved : j)) : [saved, ...js]));
      setEditing(null);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const remove = async (id) => {
    try {
      await api.deleteJob(id);
      setJobs((js) => js.filter((j) => j._id !== id));
      setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const move = async (id, status) => {
    const job = jobs.find((j) => j._id === id);
    if (!job || job.status === status) return;
    setJobs((js) => js.map((j) => (j._id === id ? { ...j, status } : j)));
    try {
      await api.updateJob(id, { status });
    } catch (e) {
      setJobs((js) => js.map((j) => (j._id === id ? job : j)));
      setError(e.message);
    }
  };

  return (
    <div>
      <header className="top">
        <h1>Job Tracker</h1>
        <input className="search" placeholder="Search company or role" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" onClick={() => setEditing({})}>Add application</button>
        <span className="who">{user.name}</span>
        <button className="btn ghost" onClick={onLogout}>Log out</button>
      </header>

      {error && <p className="banner" onClick={() => setError('')}>{error}</p>}

      <main className="board">
        {STATUSES.map((s) => {
          const list = visible.filter((j) => j.status === s);
          return (
            <section
              key={s}
              className={`col s-${s.toLowerCase()}${dragOver === s ? ' over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(s);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOver('');
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver('');
                move(e.dataTransfer.getData('text/plain'), s);
              }}
            >
              <h2>
                {s}
                <span className="count">{list.length}</span>
              </h2>
              {list.map((j) => (
                <article
                  key={j._id}
                  className="card"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', j._id)}
                  onClick={() => setEditing(j)}
                >
                  <strong>{j.company}</strong>
                  <span>{j.role}</span>
                  <small>
                    <span>{j.location}</span>
                    <span>{fmt(j.appliedDate)}</span>
                  </small>
                </article>
              ))}
              {!list.length && <p className="empty">No applications</p>}
            </section>
          );
        })}
      </main>

      {editing && <JobModal job={editing} onSave={save} onDelete={remove} onClose={() => setEditing(null)} />}
    </div>
  );
}
