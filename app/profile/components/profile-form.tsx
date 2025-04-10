"use client";

import { useState, useEffect, useRef } from "react";
import { FormInput } from "@/app/profile/components/ui/form-input";
import { Button } from "@/app/profile/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { X } from "lucide-react";

interface Experience {
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Education {
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
}

export default function ProfileForm() {
  const { user, updateProfile, isLoading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
    const [existingCv, setExistingCv] = useState<{ name: string; url: string } | null>(null);
    const [newCvFile, setNewCvFile] = useState<File | null>(null);
    const [selectedCv, setSelectedCv] = useState<'existing' | 'new'>('existing');
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);

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

    useEffect(() => {
        const fetchExistingCv = async () => {
            try {
                const response = await fetch('/api/users/resume');
                if (response.ok) {
                    const data = await response.json();
                    setExistingCv({
                        name: data.fileName,
                        url: data.url // Adjust according to your API response
                    });
                }
            } catch (err) {
                console.error('Failed to fetch CV:', err);
            }
        };

        if (user) fetchExistingCv();
    }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (fileList?.[0]) {
          setNewCvFile(fileList[0]);
          setSelectedCv('new');
      }
  };

    const handleCvUpload = async (file: File) => {
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

            return await response.json();
        } catch (err: any) {
            throw err;
        }
    };

    // Experiences Part ^^
    const addExperience = () => {
        setExperiences([...experiences, {
            id: Date.now().toString(),
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            description: ''
        }]);
    };

    const removeExperience = (id: string) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
        setExperiences(experiences.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
    };

    // Education Part ^^
    const addEducation = () => {
        setEducations([...educations, {
            id: Date.now().toString(),
            degree: '',
            institution: '',
            startDate: '',
            endDate: ''
        }]);
    };

    const removeEducation = (id: string) => {
        setEducations(educations.filter(edu => edu.id !== id));
    };

    const handleEducationChange = (id: string, field: keyof Education, value: string) => {
        setEducations(educations.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        ));
    };

    // Experience Template
    const ExperienceEntry = ({ experience }: { experience: Experience }) => (
        <div className="relative p-4 border rounded-lg bg-white mb-4">
            <button type="button" onClick={() => removeExperience(experience.id)} className="absolute top-2 right-2 text-red-600 hover:text-red-700" >
                <X size={20} />
            </button>

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Job Title" value={experience.jobTitle} onChange={(e) => handleExperienceChange(experience.id, 'jobTitle', e.target.value)} required />
                <FormInput label="Company" value={experience.company} onChange={(e) => handleExperienceChange(experience.id, 'company', e.target.value)} required />
                <FormInput label="Start Date" type="month" value={experience.startDate} onChange={(e) => handleExperienceChange(experience.id, 'startDate', e.target.value)} required />
                <FormInput label="End Date" type="month" value={experience.endDate} onChange={(e) => handleExperienceChange(experience.id, 'endDate', e.target.value)} />
                <div className="col-span-2">
                    <FormInput label="Description" value={experience.description} onChange={(e) => handleExperienceChange(experience.id, 'description', e.target.value)} textarea rows={3} />
                </div>
            </div>
        </div>
    );

    // Education Templete
    const EducationEntry = ({ education }: { education: Education }) => (
        <div className="relative p-4 border rounded-lg bg-white mb-4">
            <button type="button" onClick={() => removeEducation(education.id)} className="absolute top-2 right-2 text-red-600 hover:text-red-700" >
                <X size={20} />
            </button>

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Degree" value={education.degree} onChange={(e) => handleEducationChange(education.id, 'degree', e.target.value)} required />
                <FormInput label="Institution" value={education.institution} onChange={(e) => handleEducationChange(education.id, 'institution', e.target.value)} required />
                <FormInput label="Start Date" type="month" value={education.startDate} onChange={(e) => handleEducationChange(education.id, 'startDate', e.target.value)} required />
                <FormInput label="End Date" type="month" value={education.endDate} onChange={(e) => handleEducationChange(education.id, 'endDate', e.target.value)} />
            </div>
        </div>
    );


    // submiting update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (!user?.id) throw new Error("User ID not available");

            // Update profile data
            await updateProfile(user.id, formData);

            // Handle CV replacement if needed
            if (selectedCv === 'new' && newCvFile) {
                const data = await handleCvUpload(newCvFile);
                setExistingCv({ name: data.fileName, url: data.url });
                setNewCvFile(null);
            }

            alert("Profile updated successfully!");
        } catch (err: any) {
            setError(err.message);
        }
    };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

        <div className="space-y-4">
            <label className="block text-lg font-medium">CV</label>

            {/* Existing CV */}
            {existingCv && (
                <div className="p-4 rounded-lg bg-white border border-gray-300">
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="cv-choice"
                            checked={selectedCv === 'existing'}
                            onChange={() => setSelectedCv('existing')}
                            className="w-5 h-5 text-red-600"
                        />
                        <div className="flex-1">
                            <span className="text-gray-600">Saved Resume: </span>
                            <a
                                href={existingCv.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:underline"
                            >
                                {existingCv.name}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* New CV Upload */}
            <div className="p-4 rounded-lg bg-white border border-gray-300">
                <div className="flex items-center gap-3 mb-3">
                    <input
                        type="radio"
                        name="cv-choice"
                        checked={selectedCv === 'new'}
                        onChange={() => setSelectedCv('new')}
                        className="w-5 h-5 text-red-600"
                        disabled={!newCvFile}
                    />
                    <label className="text-gray-600">Upload New Resume:</label>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-14 text-lg rounded-lg border border-gray-200 px-3 flex items-center">
                        {newCvFile ? (
                            <span className="truncate">{newCvFile.name}</span>
                        ) : (
                            <span className="text-gray-500">No file selected</span>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={triggerFileInput}
                        className="bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-lg"
                    >
                        Choose File
                    </Button>
                </div>
            </div>
            {/* Add Experiences Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Professional Experience</h3>
                    <Button
                        type="button"
                        onClick={addExperience}
                        variant="outline"
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Add Experience
                    </Button>
                </div>

                {experiences.map(experience => (
                    <ExperienceEntry key={experience.id} experience={experience} />
                ))}
            </div>

            {/* Add Education Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">Education</h3>
                    <Button
                        type="button"
                        onClick={addEducation}
                        variant="outline"
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Add Education
                    </Button>
                </div>

                {educations.map(education => (
                    <EducationEntry key={education.id} education={education} />
                ))}
            </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />

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
