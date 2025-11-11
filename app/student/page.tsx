"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
  
declare module "next-auth" {
  interface Session {
    user?: {
      studentId?: string;
    };
  }
}
import {
  FaUserCircle,
  FaBriefcase,
  FaCheckCircle,
  FaLaptop,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const studentId = session?.user?.studentId;

  useEffect(() => {
    if (!studentId) return;

    async function fetchData() {
      try {
        const [profileRes, jobsRes, appRes] = await Promise.all([
          fetch(`/api/student?type=profile&studentId=${studentId}`),
          fetch(`/api/student?type=jobs`),
          fetch(`/api/student?type=applications&studentId=${studentId}`),
        ]);

        const profile = await profileRes.json();
        const jobs = await jobsRes.json();
        const applications = await appRes.json();

        setStudent(profile);
        setJobs(jobs);
        setApplications(applications);
      } catch (err) {
        console.error("Error fetching student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [studentId]);

  if (status === "loading" || loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              Welcome, {student?.name || "Student"}
            </span>
            <FaUserCircle className="text-xl" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <FaUserCircle className="text-blue-500" />
            <span>My Profile</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
            <p><strong>Name:</strong> {student?.name}</p>
            <p><strong>Department:</strong> {student?.department}</p>
            <p><strong>CGPA:</strong> {student?.cgpa}</p>
            <p><strong>Email:</strong> {student?.email}</p>
          </div>
        </div>

        {/* Jobs */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <FaBriefcase className="text-blue-500" />
            <span>Available Jobs</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs available right now.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="border p-5 rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                    <FaLaptop className="text-xs" />
                    <span>{job.company?.name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <FaMapMarkerAlt className="mr-1" /> {job.location}
                  </p>
                  <p className="text-sm mt-1">
                    <FaTag className="inline text-gray-400 mr-1" />
                    Package: <strong>{job.package} LPA</strong>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <FaCheckCircle className="text-blue-500" />
            <span>My Applications</span>
          </h2>
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              You haven’t applied to any jobs yet.
            </p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="flex justify-between bg-gray-50 p-4 rounded-lg border">
                  <p>{app.job?.title}</p>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-200 text-center py-4 text-gray-600 text-sm">
        © {new Date().getFullYear()} Placement Cell. All rights reserved.
      </footer>
    </div>
  );
}
