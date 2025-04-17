"use client";

import { useState, useEffect, useRef } from "react";
import { FormInput } from "@/app/profile/components/ui/form-input";
import { Button } from "@/app/profile/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { X, Plus } from "lucide-react";

interface Experience {
    id?: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Education {
    id?: string;
    degree: string;
    educationLevel: 'highschool' | 'undergrad' | 'postgrad' | 'phd';
    university: string;
    startDate: string;
    endDate: string;
}

// POPUP FOR LISTS
const Popup = ({
    isOpen,
    onClose,
    title,
    children
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700" > <X size={24} /> </button>
                </div>
                <div className="p-4 overflow-y-auto flex-grow">
                    {children}
                </div>
                <div className="p-4 border-t flex justify-end">
                    <Button type="button" onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white" > Close </Button>
                </div>
            </div>
        </div>
    );
};

export default function ProfileForm() {
    const { user, updateProfile, isLoading, error: authError, refreshUserProfile } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", cv: false });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newCvFile, setNewCvFile] = useState<File | null>(null);
    const [selectedCv, setSelectedCv] = useState<'existing' | 'new'>('existing');
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);

    // Current editing experience/education
    const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
    const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
    const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);

    // Popup states
    const [showExperiencePopup, setShowExperiencePopup] = useState(false);
    const [showEducationPopup, setShowEducationPopup] = useState(false);
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [showEducationForm, setShowEducationForm] = useState(false);

    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                cv: user.hasCV || false,
            });

            // Fetch experiences and educations
            fetchExperiences();
            fetchEducations();

            if (user.hasCV) {
                setSelectedCv('existing');
            }
            console.log("Initial hasCV value:", user.hasCV);
        }
    }, [user]);

    const handleApiResponse = async (response: Response, errorMessage: string) => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || errorMessage);
        }

        try {
            return await response.json();
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error('Invalid response from server');
        }
    };

    // Fetch experiences from API
    const fetchExperiences = async () => {
        try {
            setError(null);

            const response = await fetch('/api/users/experience');
            const data = await handleApiResponse(response, 'Failed to fetch experiences');
            const processedExperiences = Array.isArray(data.experiences)
                ? data.experiences
                : Array.isArray(data)
                    ? data
                    : [];

            const formattedExperiences = processedExperiences.map((exp: any) => ({
                id: exp.id || exp._id, // Handle both "id" and MongoDB's "_id"
                jobTitle: exp.jobTitle,
                company: exp.company,
                startDate: displayDate(exp.startDate),
                endDate: displayDate(exp.endDate),
                description: exp.description
            }));

            setExperiences(formattedExperiences);
        } catch (err) {
            setError(err.message || 'Failed to fetch experiences. Please try again.');
        }
    };

    // Fetch educations from API
    const fetchEducations = async () => {
        try {
            console.log('Fetching educations...');
            const response = await fetch('/api/users/education');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch educations');
            }
            const data = await response.json();

            // Process education data with proper ID mapping
            const processedEducations = (data.educations || data).map((edu: any) => ({
                id: edu.id || edu._id, // Handle both id and _id
                degree: edu.degree,
                educationLevel: edu.educationLevel,
                university: edu.university,
                startDate: displayDate(edu.startDate),
                endDate: displayDate(edu.endDate)
            }));
            setEducations(processedEducations);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch educations');
        }
    };

    // Resume Realted Components
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

    // Experience Functions
    const addExperience = () => {
        setCurrentExperience({
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        setEditingExperienceIndex(null);
        setShowExperienceForm(true);
    };

    const editExperience = (index: number) => {
        const expToEdit = { ...experiences[index] };

        // Make sure dates are in the YYYY-MM format for input[type=month]
        expToEdit.startDate = displayDate(expToEdit.startDate);
        expToEdit.endDate = displayDate(expToEdit.endDate);

        setCurrentExperience(expToEdit);
        setEditingExperienceIndex(index);
        setShowExperienceForm(true);
    };

    const removeExperience = async (index: number) => {
        const expToRemove = experiences[index];
        console.log('[DELETE] Initiating removal for experience:', expToRemove);

        if (!expToRemove.id) {
            console.log('[DELETE] Local-only experience removed');
            setExperiences(prev => prev.filter((_, i) => i !== index));
            return;
        }

        try {
            console.log('[DELETE] Attempting API deletion for ID:', expToRemove.id);
            const token = localStorage.getItem('token');
            console.log('[DELETE] Using token:', token ? 'exists' : 'missing');

            const response = await fetch(`/api/users/experience/${expToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('[DELETE] Response status:', response.status);
            console.log('[DELETE] Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[DELETE] Server error response:', errorText);
                throw new Error(errorText || 'Failed to delete experience');
            }

            const responseData = await response.json();
            console.log('[DELETE] Success response:', responseData);

            setExperiences(prev => prev.filter((_, i) => i !== index));
            console.log('[DELETE] UI updated optimistically');

        } catch (err) {
            console.error('[DELETE] Full error:', err);
            if (err instanceof Error) {
                console.error('[DELETE] Error details:', {
                    message: err.message,
                    stack: err.stack
                });
            }
            setError(err instanceof Error ? err.message : 'Deletion failed');
            console.log('[DELETE] Re-fetching experiences to sync state');
            fetchExperiences();
        }
    };

    const handleExperienceChange = (field: keyof Experience, value: string) => {
        if (currentExperience) {
            setCurrentExperience({
                ...currentExperience,
                [field]: value
            });
        }
    };

    const saveExperienceEntry = async () => {
        if (!currentExperience) return;

        try {
            setError(null);

            // Validate required fields
            if (!currentExperience.jobTitle || !currentExperience.company || !currentExperience.startDate) {
                setError("Please fill in all required fields: Job Title, Company, and Start Date");
                return;
            }

            // Format dates for API
            const formattedExperience = {
                ...currentExperience,
                startDate: formatDate(currentExperience.startDate),
                endDate: currentExperience.endDate ? formatDate(currentExperience.endDate) : ''
            };

            // Determine if this is an update or a new entry
            const isUpdate = editingExperienceIndex !== null && currentExperience.id !== undefined;
            const method = isUpdate ? 'PUT' : 'POST';
            const url = isUpdate ? `/api/users/experience/${currentExperience.id}` : '/api/users/experience';

            // When updating, remove ID from request body
            const requestBody = isUpdate ? (({ id, ...rest }) => rest)(formattedExperience) : formattedExperience;

            console.log(`${method} Experience - Request:`, { url, body: requestBody });

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Save failed');
            }

            // Get the saved data from response
            const savedData = await response.json();
            console.log(`${method} Experience - Response:`, savedData);

            // Create a clean processed experience - use a consistent approach to ID
            const processedExperience = {
                // For updates, maintain the same ID to avoid duplication
                id: isUpdate ? currentExperience.id : (savedData.id || savedData._id || (savedData.experience && (savedData.experience.id || savedData.experience._id))),
                jobTitle: savedData.jobTitle || currentExperience.jobTitle,
                company: savedData.company || currentExperience.company,
                startDate: displayDate(savedData.startDate || currentExperience.startDate),
                endDate: displayDate(savedData.endDate || currentExperience.endDate),
                description: savedData.description || currentExperience.description
            };

            console.log(`${method} Experience - Processed for UI:`, processedExperience);

            // Update the experiences state with a more reliable approach
            setExperiences(prev => {
                if (isUpdate && editingExperienceIndex !== null) {
                    // Create a new array with the updated item at the specific index
                    const updatedExperiences = [...prev];
                    updatedExperiences[editingExperienceIndex] = processedExperience;
                    return updatedExperiences;
                } else {
                    return [...prev, processedExperience];
                }
            });

            // Reset form state
            setCurrentExperience(null);
            setEditingExperienceIndex(null);
            setShowExperienceForm(false);

            setTimeout(() => {
                fetchExperiences(); // update without refresh :DDDDDDDDDDD (Forgot to add it)
            }, 300);

        } catch (err) {
            console.error('Experience save failed:', err);
            setError(err.message || "Failed to save experience");
        }
    };

    // Education Functions
    const addEducation = () => {
        setCurrentEducation({
            degree: '',
            educationLevel: 'highschool',
            university: '',
            startDate: '',
            endDate: ''
        });
        setEditingEducationIndex(null);
        setShowEducationForm(true);
    };

    const editEducation = (index: number) => {
        const eduToEdit = JSON.parse(JSON.stringify(educations[index]));

        eduToEdit.startDate = displayDate(eduToEdit.startDate);
        eduToEdit.endDate = displayDate(eduToEdit.endDate);

        setCurrentEducation(eduToEdit);
        setEditingEducationIndex(index);
        setShowEducationForm(true);
    };


    const removeEducation = async (index: number) => {
        const eduToRemove = educations[index];

        if (!eduToRemove.id) {
            setEducations(prev => prev.filter((_, i) => i !== index));
            return;
        }

        try {
            const response = await fetch(`/api/users/education/${eduToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Delete failed');
            }

            setEducations(prev => prev.filter((_, i) => i !== index));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete education');
            fetchEducations();
        }
    };


    const handleEducationChange = (field: keyof Education, value: string) => {
        if (currentEducation) {
            setCurrentEducation({
                ...currentEducation,
                [field]: value as any
            });
        }
    };

    const saveEducationEntry = async () => {
        if (!currentEducation) return;
        try {
            if (!currentEducation.degree || !currentEducation.university || !currentEducation.startDate) {
                setError("Please fill in all required fields: Degree, University, and Start Date");
                return;
            }

            const formattedEducation = {
                ...currentEducation,
                startDate: formatDate(currentEducation.startDate),
                endDate: currentEducation.endDate ? formatDate(currentEducation.endDate) : ''
            };

            // Use editingEducationIndex to determine if it's an update
            const isUpdate = editingEducationIndex !== null && currentEducation.id !== undefined;
            const method = isUpdate ? 'PUT' : 'POST';
            const url = isUpdate ? `/api/users/education/${currentEducation.id}` : '/api/users/education';

            // Remove ID from request body for updates
            const requestBody = isUpdate ? (({ id, ...rest }) => rest)(formattedEducation) : formattedEducation;
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Save failed');
            }
            const savedData = await response.json();
            const processedEducation = {
                id: isUpdate ? currentEducation.id : (savedData.id || savedData._id || (savedData.education && (savedData.education.id || savedData.education._id))),
                degree: savedData.degree || currentEducation.degree,
                educationLevel: savedData.educationLevel || currentEducation.educationLevel,
                university: savedData.university || currentEducation.university,
                startDate: displayDate(savedData.startDate || currentEducation.startDate),
                endDate: displayDate(savedData.endDate || currentEducation.endDate)
            };

            setEducations(prev => {
                if (isUpdate && editingEducationIndex !== null) {
                    const updatedEducations = [...prev];
                    updatedEducations[editingEducationIndex] = processedEducation;
                    return updatedEducations;
                } else {
                    return [...prev, processedEducation];
                }
            });

            setCurrentEducation(null);
            setEditingEducationIndex(null);
            setShowEducationForm(false);

            setTimeout(() => {
                fetchEducations();
            }, 300);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save education');
        }
    };

    // Experience Form
    const renderExperienceForm = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">
                {editingExperienceIndex !== null ? 'Edit Experience' : 'Add Experience'}
            </h3>
            <div className="space-y-4">
                <FormInput label="Job Title" value={currentExperience?.jobTitle || ''} onChange={(e) => handleExperienceChange('jobTitle', e.target.value)} required />
                <FormInput label="Company" value={currentExperience?.company || ''} onChange={(e) => handleExperienceChange('company', e.target.value)} required />
                <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Start Date" type="month" value={currentExperience?.startDate || ''} onChange={(e) => handleExperienceChange('startDate', e.target.value)} required />
                    <FormInput label="End Date" type="month" value={currentExperience?.endDate || ''} onChange={(e) => handleExperienceChange('endDate', e.target.value)} />
                </div>

                <div>
                    <FormInput label="Description" value={currentExperience?.description || ''} onChange={(e) => handleExperienceChange('description', e.target.value)} textarea rows={3} />
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowExperienceForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-800" > Cancel </Button>
                <Button type="button" onClick={saveExperienceEntry} className="bg-red-600 hover:bg-red-700 text-white" > Save </Button>
            </div>
        </div>
    );

    // Education Form
    const renderEducationForm = () => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">
                {editingEducationIndex !== null ? 'Edit Education' : 'Add Education'}
            </h3>
            <div className="space-y-4">
                <FormInput label="Degree" value={currentEducation?.degree || ''} onChange={(e) => handleEducationChange('degree', e.target.value)} required />
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700"> Education Level </label>
                    <select value={currentEducation?.educationLevel || 'highschool'} onChange={(e) => handleEducationChange('educationLevel', e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 p-2 h-12 text-base">
                        <option value="highschool">High School</option>
                        <option value="undergrad">Undergraduate</option>
                        <option value="postgrad">Postgraduate</option>
                        <option value="phd">PhD</option>
                    </select>
                </div>
                <FormInput label="University/Institution" value={currentEducation?.university || ''} onChange={(e) => handleEducationChange('university', e.target.value)} required />
                <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Start Date" type="month" value={currentEducation?.startDate || ''} onChange={(e) => handleEducationChange('startDate', e.target.value)} required />
                    <FormInput label="End Date" type="month" value={currentEducation?.endDate || ''} onChange={(e) => handleEducationChange('endDate', e.target.value)} />
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEducationForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-800" > Cancel </Button>
                <Button type="button" onClick={saveEducationEntry} className="bg-red-600 hover:bg-red-700 text-white" > Save </Button>
            </div>
        </div>
    );

    // Experience List Item for popup
    const ExperienceListItem = ({ experience, index }: { experience: Experience, index: number }) => (
        <div className="p-4 border rounded-lg bg-white mb-4 shadow-sm">
            <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-lg text-red-600">{experience.jobTitle}</h4>
                <div className="flex gap-2">
                    <button type="button" onClick={() => editExperience(index)} className="text-blue-600 hover:text-blue-700" > Edit </button>
                    <button type="button" onClick={() => removeExperience(index)} className="text-red-600 hover:text-red-700"> <X size={20} /> </button>
                </div>
            </div>
            <div className="mb-2">
                <span className="text-gray-700 font-medium">Company:</span> {experience.company}
            </div>
            <div className="flex gap-6 mb-2 text-sm text-gray-600">
                <span>From: {experience.startDate}</span>
                <span>To: {experience.endDate || 'Present'}</span>
            </div>
            {experience.description && (
                <div className="mt-2 text-gray-700 text-sm">
                    <p>{experience.description}</p>
                </div>
            )}
        </div>
    );

    // Education List Item for popup
    const EducationListItem = ({ education, index }: { education: Education, index: number }) => (
        <div className="p-4 border rounded-lg bg-white mb-4 shadow-sm">
            <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-lg text-red-600">{education.degree}</h4>
                <div className="flex gap-2">
                    <button type="button" onClick={() => editEducation(index)} className="text-blue-600 hover:text-blue-700" > Edit </button>
                    <button type="button" onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-700" > <X size={20} /> </button>
                </div>
            </div>
            <div className="mb-2">
                <span className="text-gray-700 font-medium">University:</span> {education.university}
            </div>
            <div className="mb-1">
                <span className="text-gray-700 font-medium">Level:</span> {
                    education.educationLevel === 'highschool' ? 'High School' :
                        education.educationLevel === 'undergrad' ? 'Undergraduate' :
                            education.educationLevel === 'postgrad' ? 'Postgraduate' : 'PhD'
                }
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
                <span>From: {education.startDate}</span>
                <span>To: {education.endDate || 'Present'}</span>
            </div>
        </div>
    );

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

    const formatDate = (date: string): string => {
        if (!date) return '';

        if (/^\d{4}-\d{2}$/.test(date)) {
            return `${date}-01`;
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.error(`Invalid date: ${date}`);
            return ''; // Return empty to avoid breaking things
        }

        // Format as YYYY-MM-DD for API
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const displayDate = (apiDate: string): string => {
        if (!apiDate) return '';

        if (/^\d{4}-\d{2}$/.test(apiDate)) {
            return apiDate;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(apiDate)) {
            return apiDate.substring(0, 7);
        }

        const parsedDate = new Date(apiDate);
        if (isNaN(parsedDate.getTime())) {
            return ''; // Invalid date
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
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
                    <label htmlFor="name" className="block text-lg font-medium mb-3">Name</label>
                    <FormInput id="name" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} aria-label="Name" className="h-14 text-lg rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium mb-3">Email</label>
                        <FormInput id="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} type="email" className="h-14 text-lg rounded-lg" />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium mb-3">Phone</label>
                        <FormInput id="phone" name="phone" placeholder="+1234567890" value={formData.phone || ""} onChange={handleChange} className="h-14 text-lg rounded-lg" />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-lg font-medium">CV</label>

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
                    {/* Experience section - just a button */}
                    <div className="mt-8 flex justify-between items-center">
                        <h3 className="text-2xl font-semibold text-gray-800">Professional Experience</h3>
                        <Button type="button" onClick={() => setShowExperiencePopup(true)} className="bg-red-600 hover:bg-red-700 text-white" >
                            Manage Experience ({experiences.length})</Button>
                    </div>
                    {/* Education section - just a button */}
                    <div className="mt-6 flex justify-between items-center">
                        <h3 className="text-2xl font-semibold text-gray-800">Education</h3>
                        <Button type="button" onClick={() => setShowEducationPopup(true)} className="bg-red-600 hover:bg-red-700 text-white" >
                            Manage Education ({educations.length})</Button>
                    </div>
                </div>
            </div>

            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />

            {(error || authError) && (
                <p className="text-red-500 mt-2">{error || authError}</p>
            )}

            <div className="pt-8">
                <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-lg" >
                    {isLoading ? "Updating..." : "Update"}
                </Button>
            </div>

            {/* Experience Popup */}
            <Popup isOpen={showExperiencePopup} onClose={() => setShowExperiencePopup(false)} title="Professional Experience">
                {showExperienceForm ? renderExperienceForm() : (
                    <div className="space-y-4">
                        {experiences.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No experiences added yet.</p>
                        ) : (
                            experiences.map((experience, index) => (
                                <ExperienceListItem key={index} experience={experience} index={index} />
                            ))
                        )}
                        <div className="flex justify-center mt-4">
                            <Button type="button" onClick={addExperience} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2" >
                                <Plus size={18} /> Add New Experience
                            </Button>
                        </div>
                    </div>
                )}
            </Popup>

            {/* Education Popup */}
            <Popup isOpen={showEducationPopup} onClose={() => setShowEducationPopup(false)} title="Education History">
                {showEducationForm ? renderEducationForm() : (
                    <div className="space-y-4">
                        {educations.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No education entries added yet.</p>
                        ) : (
                            educations.map((education, index) => (
                                <EducationListItem key={index} education={education} index={index} />
                            ))
                        )}
                        <div className="flex justify-center mt-4">
                            <Button type="button" onClick={addEducation} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2" >
                                <Plus size={18} /> Add New Education
                            </Button>
                        </div>
                    </div>
                )}
            </Popup>
        </form>
    );
}