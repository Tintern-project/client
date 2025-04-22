"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

export default function SignupForm() {
  const router = useRouter();
  const { signup, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    educationLevel: "undergrad",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectEducationLevel = (level: string) => {
    setFormData((prev) => ({ ...prev, educationLevel: level }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(formData);
      // The redirect is handled in the auth context
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-[#F5F5F5]">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Abdo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-[#1E1E1E] border border-[#4B4B4B] text-[#F5F5F5] focus:outline-none focus:border-[#C00F0C]"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[#F5F5F5]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Abdo@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-[#1E1E1E] border border-[#4B4B4B] text-[#F5F5F5] focus:outline-none focus:border-[#C00F0C]"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-[#F5F5F5]">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-[#1E1E1E] border border-[#4B4B4B] text-[#F5F5F5] focus:outline-none focus:border-[#C00F0C]"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-[#F5F5F5]">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-[#1E1E1E] border border-[#4B4B4B] text-[#F5F5F5] focus:outline-none focus:border-[#C00F0C]"
          />
        </div>

        {/* Education Level */}
        <div className="space-y-2">
          <label htmlFor="educationLevel" className="block text-[#F5F5F5]">
            Education Level
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded bg-[#1E1E1E] border border-[#4B4B4B] text-[#F5F5F5] focus:outline-none focus:border-[#C00F0C] flex justify-between items-center"
            >
              <span>{formData.educationLevel}</span>
              <ChevronDown className="h-5 w-5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-[#1E1E1E] border border-[#4B4B4B] rounded shadow-lg">
                <div
                  className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer"
                  onClick={() => handleSelectEducationLevel("undergrad")}
                >
                  Undergrad
                </div>
                <div
                  className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer"
                  onClick={() => handleSelectEducationLevel("postgrad")}
                >
                  Postgrad
                </div>
              </div>
            )}
          </div>
        </div>

      
      </div>

      {(error || authError) && (
        <p className="mt-4 text-red-500 text-center">{error || authError}</p>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF6868] hover:bg-[#FF6868]/90 text-white font-medium py-3 px-4 rounded transition-all duration-300"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}
