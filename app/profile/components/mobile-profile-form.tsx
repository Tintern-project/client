"use client";

import { useState, useEffect, useRef } from "react";
import { FormInput } from "@/app/profile/components/ui/form-input";
import { Button } from "@/app/profile/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/auth-context";

export default function MobileProfileForm() {
  const { user, updateProfile, isLoading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadedCvName, setUploadedCvName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async () => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setUploadedCvName(file.name);
      handleCvUpload(file);
    }
  };

  const handleCvUpload = async (file: File) => {
    if (!file) return;

    setUploadingCv(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/users/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload CV");
      }

      const data = await response.json();
      setUploadedCvName(file.name);
      alert("CV uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload CV");
      console.error("CV upload error:", err);
    } finally {
      setUploadingCv(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white px-4 py-6">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3 bg-[#222] rounded-full py-2 px-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/hero.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span className="text-xl">
            Hi {user?.name?.split(" ")[0] || "User"}
          </span>
        </div>
      </div>

      <div className="space-y-6 relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
          <span className="text-blue-500 text-6xl font-bold tracking-widest">
            INTERN
          </span>
        </div>

        <div>
          <label htmlFor="mobile-name" className="block text-white mb-2">
            Name
          </label>
          <FormInput
            id="mobile-name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="rounded-xl h-12 text-base text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="mobile-email" className="block text-white mb-2">
            Email
          </label>
          <FormInput
            id="mobile-email"
            name="email"
            placeholder="Example@gmail.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl h-12 text-base text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="mobile-phone" className="block text-white mb-2">
            Phone
          </label>
          <FormInput
            id="mobile-phone"
            name="phone"
            placeholder="+1234567890"
            value={formData.phone || ""}
            onChange={handleChange}
            className="rounded-xl h-12 text-base text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="mobile-cv" className="block text-white mb-2">
            CV
          </label>
          <div className="rounded-xl h-12 text-base bg-[#222] border border-[#333] px-3 flex items-center">
            {uploadedCvName ? (
              <span className="truncate">{uploadedCvName}</span>
            ) : (
              <span className="text-gray-400">No file selected</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id="mobile-cv"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 px-8 text-base"
            onClick={triggerFileInput}
            disabled={uploadingCv}
          >
            {uploadingCv ? "Uploading..." : "Upload a CV"}
          </Button>
        </div>

        {(error || authError) && (
          <p className="text-red-500 mt-2">{error || authError}</p>
        )}

        <div className="pt-8">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}
