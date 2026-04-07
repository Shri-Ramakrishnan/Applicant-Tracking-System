import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading profile...</div>;
  }

  if (!data) {
    return <div className="py-10 text-center text-red-500">{error || "Profile unavailable."}</div>;
  }

  const skills = Array.isArray(data.extraData?.skills)
    ? data.extraData.skills.join(", ")
    : data.extraData?.skills;

  return (
    <section className="mx-auto max-w-xl">
      <div className="card">
        <h1 className="mb-6 text-2xl font-bold">Profile Information</h1>

        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
          <p>
            <span className="font-semibold">Name:</span> {data.user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {data.user.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {data.user.role}
          </p>

          {data.extraData && data.user.role === "recruiter" && (
            <p>
              <span className="font-semibold">Organization:</span> {data.extraData.organization}
            </p>
          )}

          {data.extraData && data.user.role === "applicant" && (
            <>
              <p>
                <span className="font-semibold">Skills:</span> {skills || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Experience:</span> {data.extraData.experience ?? 0} years
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
