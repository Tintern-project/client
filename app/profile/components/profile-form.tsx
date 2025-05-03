"use client";

import { useState, useEffect, useRef } from "react";
import { FormInput } from "@/app/profile/components/ui/form-input";
import { Button } from "@/app/profile/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import ExperienceManager, { Experience } from "./ExperiencesManger";
import EducationManager, { Education } from "./EducationsManger";
import ApplicationsManager, { Application } from "./ApplicationManger";
import Popup from "./ui/popup";

export default function ProfileForm() {
    const { user, updateProfile, isLoading, error: authError, refreshUserProfile } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", hasCV: false });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newCvFile, setNewCvFile] = useState<File | null>(null);
    const [selectedCv, setSelectedCv] = useState<'existing' | 'new'>('existing');

    // State for experiences and educations - now managed by their respective components
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);

    // Tracking loading states
    const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);
    const [isLoadingEducations, setIsLoadingEducations] = useState(true);

    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                hasCV: user.hasCV || false,
            });

            if (user.hasCV) {
                setSelectedCv('existing');
            }
        }
    }, [user]);

    // Handle experience and education loading completion
    const handleExperiencesLoaded = () => {
        setIsLoadingExperiences(true);
    };

    const handleEducationsLoaded = () => {
        setIsLoadingEducations(true);
    };

    // Resume Related Components
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList?.[0]) {
            setNewCvFile(fileList[0]);
            setSelectedCv('new'); // Auto-select the new CV when uploaded
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleCvUpload = async (file: File) => {
        try {
            // Create a FormData object to properly send the file
            const formData = new FormData();
            formData.append("file", file);
            // Use the correct API endpoint - needs to match your route handler
            const response = await fetch("/api/users/resume", {
                method: "POST",
                // Don't set Content-Type here, the browser will set it correctly with the boundary
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to upload CV");
            }
            // Get the updated user data including hasCV status
            await refreshUserProfile();
            return await response.json();
        } catch (err: any) {
            console.error("CV upload error:", err);
            throw err;
        }
    };

    // submiting update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (!user?.id) throw new Error("User ID not available");

            await updateProfile(user.id, formData);

            if (selectedCv === 'new' && newCvFile) {
                const data = await handleCvUpload(newCvFile);
                setNewCvFile(null);
                setSelectedCv('existing'); // Reset selection after successful upload
            }

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
            <h1 className="text-5xl font-bold text-red-600 mb-1">
                Hello, {user?.name || "User"}
            </h1>

            <div className="space-y-8">
                {/* Applications section - just a button */}
                <ApplicationsManager
                    applications={applications}
                    setApplications={setApplications}
                    autoFetch={true}
                />

                <div className="block mb-3">
                    <label htmlFor="name" className="block text-lg font-medium mb-3">Name</label>
                    <FormInput id="name" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} aria-label="Name" className="h-14 text-lg rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-5">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium mb-3">Email</label>
                        <FormInput id="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} type="email" className="h-14 text-lg rounded-lg" />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium mb-3">Phone</label>
                        <FormInput id="phone" name="phone" placeholder="+1234567890" value={formData.phone || ""} onChange={handleChange} className="h-14 text-lg rounded-lg" />
                    </div>
                </div>

                <div className="space-y-4 mb-5">
                    <div className="rounded-lg border border-gray-300 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
                            <h3 className="text-lg font-medium text-gray-700">Resume Selection</h3>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Existing CV option */}
                            {user?.hasCV && (
                                <div className="p-4 rounded-lg bg-white border border-gray-300">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            id="existing-cv"
                                            name="cv-choice"
                                            checked={selectedCv === 'existing'}
                                            onChange={() => setSelectedCv('existing')}
                                            className="w-5 h-5 text-red-600"
                                        />
                                        <label htmlFor="existing-cv" className="flex-1">
                                            <span className="text-gray-600">Latest Uploaded CV</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* New CV Upload option */}
                            <div className="p-4 rounded-lg bg-white border border-gray-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <input type="radio" id="new-cv" name="cv-choice" checked={selectedCv === 'new'} onChange={() => newCvFile ? setSelectedCv('new') : null} className="w-5 h-5 text-red-600" disabled={!newCvFile} />
                                    <label htmlFor="new-cv" className="text-gray-600">
                                        {user?.hasCV ? "Upload New Resume:" : "Upload Resume:"}
                                    </label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-14 text-lg rounded-lg border border-gray-200 px-3 flex items-center">
                                        {newCvFile ? (
                                            <span className="truncate">{newCvFile.name}</span>
                                        ) : (
                                            <span className="text-gray-500">No file selected</span>
                                        )}
                                    </div>
                                    <Button type="button" variant="secondary" onClick={triggerFileInput} className="bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-lg" > Choose File </Button>
                                </div>
                                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex gap-5 justify-center mb-2">
                    <div className="flex gap-5 md:flex-nowrap w-full max-w-4xl mx-auto">
                        {/* Experience component */}
                        <ExperienceManager
                            experiences={experiences}
                            setExperiences={setExperiences}
                            onFetchComplete={handleExperiencesLoaded}
                            autoFetch={true}
                        />

                        {/* Education component would be similar */}
                        <EducationManager
                            educations={educations}
                            setEducations={setEducations}
                            onFetchComplete={handleEducationsLoaded}
                            autoFetch={true}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white text-lg rounded-lg py-6" >
                    {isLoading ? "Updating..." : "Update"}
                </Button>
            </div>

            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />

            {(error || authError) && (
                <p className="text-red-500 mt-2">{error || authError}</p>
            )}
        </form>
    );
}