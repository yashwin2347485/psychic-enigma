"use client";
import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaBriefcase,
  FaUserCheck,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyForm, setCompanyForm] = useState({
    name: "",
    email: "",
    industry: "",
    location: "",
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    package: "",
    companyId: "",
  });

  // ✅ Fetch all dashboard data
  async function fetchData() {
    setLoading(true);
    try {
      const [companiesRes, jobsRes, appsRes] = await Promise.all([
        fetch("/api/admin?type=companies"),
        fetch("/api/admin?type=jobs"),
        fetch("/api/admin?type=applications"),
      ]);

      const [companiesData, jobsData, appsData] = await Promise.all([
        companiesRes.json(),
        jobsRes.json(),
        appsRes.json(),
      ]);

      setCompanies(companiesData);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Add New Company
  async function addCompany() {
    if (!companyForm.name || !companyForm.email || !companyForm.industry || !companyForm.location) {
      alert("⚠️ Please fill in all company details");
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "company", ...companyForm }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Company Added: ${data.name}`);
        setCompanyForm({ name: "", email: "", industry: "", location: "" });
        fetchData();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error("Error adding company:", err);
    }
  }

  // ✅ Post New Job
  async function postJob() {
    if (!jobForm.title || !jobForm.package || !jobForm.companyId) {
      alert("⚠️ Please fill all job fields");
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job",
          title: jobForm.title,
          package: jobForm.package,
          companyId: jobForm.companyId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Job Posted: ${data.title}`);
        setJobForm({ title: "", package: "", companyId: "" });
        fetchData();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error("Error posting job:", err);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-amber-100 text-amber-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">⏳ Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
          <a
            href="/"
            className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Logout
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <FaBuilding className="text-4xl text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">Total Companies</p>
              <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <FaBriefcase className="text-4xl text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <FaUserCheck className="text-4xl text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Company */}
          <div className="bg-white shadow-md rounded-xl p-7">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
              <FaBuilding className="text-blue-500" /> Add New Company
            </h2>
            <div className="space-y-4">
              <input
                value={companyForm.name}
                onChange={(e) => setCompanyForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Company Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                value={companyForm.email}
                onChange={(e) => setCompanyForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Company Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                value={companyForm.industry}
                onChange={(e) => setCompanyForm((p) => ({ ...p, industry: e.target.value }))}
                placeholder="Industry (e.g. Software)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                value={companyForm.location}
                onChange={(e) => setCompanyForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Location"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addCompany}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700"
              >
                Add Company
              </button>
            </div>
          </div>

          {/* Post Job */}
          <div className="bg-white shadow-md rounded-xl p-7">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
              <FaBriefcase className="text-blue-500" /> Post New Job
            </h2>
            <div className="space-y-4">
              <input
                value={jobForm.title}
                onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Job Title"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                value={jobForm.package}
                onChange={(e) => setJobForm((p) => ({ ...p, package: e.target.value }))}
                placeholder="Package (LPA)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={jobForm.companyId}
                onChange={(e) => setJobForm((p) => ({ ...p, companyId: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                onClick={postJob}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
              >
                Post Job
              </button>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white shadow-md rounded-xl p-7">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3">
            <FaUserCheck className="text-blue-500" /> Recent Applications
          </h2>

          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No applications have been submitted yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((a) => (
                    <tr key={a.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{a.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{a.jobTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{a.companyName}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
