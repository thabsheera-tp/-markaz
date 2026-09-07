'use client';
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  PlusCircle,
  Search,
  Building2,
  Trash2,
  Edit2,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { api } from '../../services/api';

const FEE_COLORS = {
  Paid: '#2d8b46',
  Partial: '#c59b27',
  Scholarship: '#0a2e4a',
  Due: '#c0392b'
};

export default function StudentTrackerView({ user }) {
  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [instFilter, setInstFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState('all');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution_id: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    fee_status: 'Paid'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [instFilter, feeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsRes, instRes] = await Promise.all([
        api.getStudents({
          search,
          institution_id: instFilter,
          fee_status: feeFilter
        }),
        api.getInstitutions()
      ]);
      setStudents(studentsRes.students || []);
      setInstitutions(instRes.institutions || []);
    } catch (err) {
      console.error('Failed to load student tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      institution_id: institutions[0]?.id || '',
      enrollment_date: new Date().toISOString().split('T')[0],
      fee_status: 'Paid'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email || '',
      phone: student.phone || '',
      institution_id: student.institution_id || '',
      enrollment_date: student.enrollment_date || new Date().toISOString().split('T')[0],
      fee_status: student.fee_status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Student name is required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingStudent) {
        await api.updateStudent(editingStudent.id, formData);
      } else {
        await api.addStudent(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to remove student #${id}?`)) return;
    try {
      await api.deleteStudent(id);
      loadData();
    } catch (err) {
      alert('Failed to delete student: ' + err.message);
    }
  };

  // Compute Enrollment Per Course Chart Data
  const courseCounts = {};
  institutions.forEach((i) => {
    courseCounts[i.name] = i.enrollment_count || 0;
  });
  const chartData = institutions.map((i) => ({
    name: i.name.replace("College of ", "").replace("Tahfeezul ", "").substring(0, 16),
    fullName: i.name,
    count: i.enrollment_count || 0
  }));

  // Fee Status distribution
  const feeDistribution = [
    { name: 'Paid', value: students.filter((s) => s.fee_status === 'Paid').length },
    { name: 'Scholarship', value: students.filter((s) => s.fee_status === 'Scholarship').length },
    { name: 'Partial', value: students.filter((s) => s.fee_status === 'Partial').length },
    { name: 'Due', value: students.filter((s) => s.fee_status === 'Due').length },
  ].filter((f) => f.value > 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institutional & Student Enrollment Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track student intake, institutional course distribution, and fee status across 9 departments.
          </p>
        </div>
        <div>
          {user?.role !== 'viewer' && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-markaz-green/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
          <div className="mt-2 text-2xl font-black text-slate-900">{students.length}</div>
          <div className="text-[11px] text-slate-500">Across 9 faculties</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Status</span>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            {students.filter((s) => s.fee_status === 'Paid').length}
          </div>
          <div className="text-[11px] text-slate-500">Full clearance</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scholarship / Free</span>
          <div className="mt-2 text-2xl font-black text-markaz-blue">
            {students.filter((s) => s.fee_status === 'Scholarship').length}
          </div>
          <div className="text-[11px] text-slate-500">Destitute & Hafiz support</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending / Due</span>
          <div className="mt-2 text-2xl font-black text-rose-600">
            {students.filter((s) => s.fee_status === 'Due' || s.fee_status === 'Partial').length}
          </div>
          <div className="text-[11px] text-slate-500">Pending review</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Course Enrollment Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Enrollment Distribution by Institution
            </h3>
            <p className="text-xs text-slate-400 mb-4">Current student numbers across all 9 departments</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val, name, item) => [val, item.payload.fullName]}
                    contentStyle={{ backgroundColor: '#0a2e4a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Bar dataKey="count" fill="#2d8b46" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Fee Status Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Fee Status Profile
            </h3>
            <p className="text-xs text-slate-400 mb-4">Paid vs Scholarship vs Due</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {feeDistribution.map((entry) => (
                      <Cell key={entry.name} fill={FEE_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a2e4a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
            />
          </div>

          <div>
            <select
              value={instFilter}
              onChange={(e) => setInstFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Institutions</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Fee Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Partial">Partial</option>
              <option value="Due">Due</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Student Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Showing {students.length} Student Records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Institution / Course</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Enrolled Date</th>
                <th className="px-5 py-3">Fee Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-400">#{s.id}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">{s.name}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {s.institution_name || 'General Campus'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-slate-700 font-mono text-[11px]">{s.phone || '—'}</div>
                    <div className="text-slate-400 text-[10px] truncate max-w-[140px]">{s.email || ''}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{s.enrollment_date || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                      style={{
                        backgroundColor: `${FEE_COLORS[s.fee_status]}15`,
                        color: FEE_COLORS[s.fee_status]
                      }}
                    >
                      {s.fee_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1">
                    {user?.role !== 'viewer' && (
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No student records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ENROLL / EDIT STUDENT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter academic enrollment and contact details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammed Bilal K."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-markaz-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institution / Department *
                </label>
                <select
                  required
                  value={formData.institution_id}
                  onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="">Select Department</option>
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9447..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fee Status
                  </label>
                  <select
                    value={formData.fee_status}
                    onChange={(e) => setFormData({ ...formData, fee_status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Partial">Partial</option>
                    <option value="Due">Due</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="student@koyyammarkaz.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  value={formData.enrollment_date}
                  onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-markaz-green hover:bg-markaz-green-dark text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
                >
                  {submitting ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
