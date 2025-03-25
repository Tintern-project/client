"use client";

import { useState, useEffect } from "react";
import { FormInput } from "@/app/profile/components/ui/form-input";
import { FormSelect } from "@/app/profile/components/ui/form-select";
import { Button } from "@/app/profile/components/ui/button";
import { useAuth } from "@/app/context/auth-context";

export default function ProfileForm() {
  const { user, updateProfile, isLoading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User ID not available");
      }

      await updateProfile(user.id, formData);
      alert("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <h1 className="text-5xl font-bold text-red-600">
        Hello, {user?.name || "User"}
      </h1>

      <div className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-3">
            Name
          </label>
          <FormInput
            id="name"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            aria-label="Name"
            className="h-14 text-lg rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-3">
              Email
            </label>
            <FormInput
              id="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="h-14 text-lg rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-lg font-medium mb-3">
              Phone
            </label>
            <FormInput
              id="phone"
              name="phone"
              placeholder="+1234567890"
              value={formData.phone || ""}
              onChange={handleChange}
              className="h-14 text-lg rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 items-end">
          <div>
            <label
              htmlFor="cv-select"
              className="block text-lg font-medium mb-3"
            >
              CV
            </label>
            <FormSelect id="cv-select" className="h-14 text-lg rounded-lg">
              <option>Choose From Uploaded Ones</option>
              <option>resume_2023.pdf</option>
              <option>cv_latest.pdf</option>
            </FormSelect>
          </div>

          <div>
            <Button
              variant="secondary"
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-lg w-full"
            >
              Upload a CV
            </Button>
          </div>
        </div>
      </div>

      {(error || authError) && (
        <p className="text-red-500 mt-2">{error || authError}</p>
      )}

      <div className="pt-8">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-lg"
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
