import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-400">
        Loading profile...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto card p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Profile Information
      </h2>

      <div className="space-y-4 text-slate-300">
        <p>
          <span className="text-slate-400">Name:</span> {data.user.name}
        </p>
        <p>
          <span className="text-slate-400">Email:</span> {data.user.email}
        </p>
        <p>
          <span className="text-slate-400">Role:</span> {data.user.role}
        </p>

        {data.extraData && data.user.role === "recruiter" && (
          <p>
            <span className="text-slate-400">Organization:</span>{" "}
            {data.extraData.organization}
          </p>
        )}

        {data.extraData && data.user.role === "applicant" && (
          <>
            <p>
              <span className="text-slate-400">Skills:</span>{" "}
              {data.extraData.skills}
            </p>
            <p>
              <span className="text-slate-400">Experience:</span>{" "}
              {data.extraData.experience}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;