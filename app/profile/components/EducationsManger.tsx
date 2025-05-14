"use client";

import { useState, useEffect } from "react";
import { FormInput } from "@/app/profile/components/ui/form-input";
import { Button } from "@/app/profile/components/ui/button";
import { X, Plus } from "lucide-react";
import Popup from "./ui/popup"; // Update to use the new Popup component

export interface Education {
    id?: string;
    degree: string;
    educationLevel: 'highschool' | 'undergrad' | 'postgrad' | 'phd';
    university: string;
    startDate: string;
    endDate: string;
}

interface EducationManagerProps {
    educations: Education[];
    setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
    // Added to allow parent to know when fetch is complete
    onFetchComplete?: () => void;
    // Added to control whether this component should auto-fetch
    autoFetch?: boolean;
}

const EducationManager = ({
    educations,
    setEducations,
    onFetchComplete,
    autoFetch = true // Default to true for backward compatibility
}: EducationManagerProps) => {
    const [showEducationPopup, setShowEducationPopup] = useState(false);
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
    const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch educations from API
    const fetchEducations = async () => {
        try {
            setError(null);

            const response = await fetch('/api/users/education');
            const data = await handleApiResponse(response, 'Failed to fetch educations');

            const processedEducations = Array.isArray(data.educations)
                ? data.educations
                : Array.isArray(data)
                    ? data
                    : [];

            // Process education data with proper ID mapping
            const formattedEducations = processedEducations.map((edu: any) => ({
                id: edu.id || edu._id, // Handle both id and _id
                degree: edu.degree,
                educationLevel: edu.educationLevel,
                university: edu.university,
                startDate: displayDate(edu.startDate),
                endDate: displayDate(edu.endDate)
            }));

            setEducations(formattedEducations);

            // Call the callback if provided
            if (onFetchComplete) {
                onFetchComplete();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch educations. Please try again.');
        }
    };

    // Expose the fetch method through a ref if needed by parent components
    // This allows the parent to trigger a fetch whenever needed
    useEffect(() => {
        // Only auto-fetch if the flag is true
        if (autoFetch) {
            fetchEducations();
        }
    }, [autoFetch]);

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
        const eduToEdit = { ...educations[index] };

        // Make sure dates are in the YYYY-MM format for input[type=month]
        eduToEdit.startDate = displayDate(eduToEdit.startDate);
        eduToEdit.endDate = displayDate(eduToEdit.endDate);

        setCurrentEducation(eduToEdit);
        setEditingEducationIndex(index);
        setShowEducationForm(true);
    };

    const removeEducation = async (index: number) => {
        const eduToRemove = educations[index];
        console.log('[DELETE] Initiating removal for education:', eduToRemove);

        if (!eduToRemove.id) {
            console.log('[DELETE] Local-only education removed');
            setEducations(prev => prev.filter((_, i) => i !== index));
            return;
        }

        try {
            console.log('[DELETE] Attempting API deletion for ID:', eduToRemove.id);
            const token = localStorage.getItem('token');
            console.log('[DELETE] Using token:', token ? 'exists' : 'missing');

            const response = await fetch(`/api/users/education/${eduToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log('[DELETE] Response status:', response.status);
            console.log('[DELETE] Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[DELETE] Server error response:', errorText);
                throw new Error(errorText || 'Failed to delete education');
            }

            const responseData = await response.json();
            console.log('[DELETE] Success response:', responseData);

            setEducations(prev => prev.filter((_, i) => i !== index));
            console.log('[DELETE] UI updated optimistically');

        } catch (err: any) {
            console.error('[DELETE] Full error:', err);
            if (err instanceof Error) {
                console.error('[DELETE] Error details:', {
                    message: err.message,
                    stack: err.stack
                });
            }
            setError(err instanceof Error ? err.message : 'Deletion failed');
            console.log('[DELETE] Re-fetching educations to sync state');
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
            setError(null);

            // Validate required fields
            if (!currentEducation.degree || !currentEducation.university || !currentEducation.startDate) {
                setError("Please fill in all required fields: Degree, University, and Start Date");
                return;
            }

            // Format dates for API
            const formattedEducation = {
                ...currentEducation,
                startDate: formatDate(currentEducation.startDate),
                endDate: currentEducation.endDate ? formatDate(currentEducation.endDate) : ''
            };

            // Determine if this is an update or a new entry
            const isUpdate = editingEducationIndex !== null && currentEducation.id !== undefined;
            const method = isUpdate ? 'PUT' : 'POST';
            const url = isUpdate ? `/api/users/education/${currentEducation.id}` : '/api/users/education';

            // When updating, remove ID from request body
            const requestBody = isUpdate ? (({ id, ...rest }) => rest)(formattedEducation) : formattedEducation;

            console.log(`${method} Education - Request:`, { url, body: requestBody });

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Save failed');
            }

            // Get the saved data from response
            const savedData = await response.json();
            console.log(`${method} Education - Response:`, savedData);

            // Create a clean processed education - use a consistent approach to ID
            const processedEducation = {
                // For updates, maintain the same ID to avoid duplication
                id: isUpdate ? currentEducation.id : (savedData.id || savedData._id || (savedData.education && (savedData.education.id || savedData.education._id))),
                degree: savedData.degree || currentEducation.degree,
                educationLevel: savedData.educationLevel || currentEducation.educationLevel,
                university: savedData.university || currentEducation.university,
                startDate: displayDate(savedData.startDate || currentEducation.startDate),
                endDate: displayDate(savedData.endDate || currentEducation.endDate)
            };

            console.log(`${method} Education - Processed for UI:`, processedEducation);

            // Update the educations state with a more reliable approach
            setEducations(prev => {
                if (isUpdate && editingEducationIndex !== null) {
                    // Create a new array with the updated item at the specific index
                    const updatedEducations = [...prev];
                    updatedEducations[editingEducationIndex] = processedEducation;
                    return updatedEducations;
                } else {
                    return [...prev, processedEducation];
                }
            });

            // Reset form state
            setCurrentEducation(null);
            setEditingEducationIndex(null);
            setShowEducationForm(false);

            setTimeout(() => {
                fetchEducations(); // update without refresh
            }, 300);

        } catch (err: any) {
            console.error('Education save failed:', err);
            setError(err.message || "Failed to save education");
        }
    };

    // Education Form
    const renderEducationForm = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                {editingEducationIndex !== null ? 'Edit Education' : 'Add New Education'}
            </h3>

            <div className="space-y-5">
                <FormInput
                    label="Degree"
                    value={currentEducation?.degree || ''}
                    onChange={(e) => handleEducationChange('degree', e.target.value)}
                    required
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Education Level</label>
                    <select
                        value={currentEducation?.educationLevel || 'highschool'}
                        onChange={(e) => handleEducationChange('educationLevel', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 h-12 text-base focus:border-red-500 focus:ring-red-500"
                    >
                        <option value="highschool">High School</option>
                        <option value="undergrad">Undergraduate</option>
                        <option value="postgrad">Postgraduate</option>
                        <option value="phd">PhD</option>
                    </select>
                </div>

                <FormInput
                    label="University/Institution"
                    value={currentEducation?.university || ''}
                    onChange={(e) => handleEducationChange('university', e.target.value)}
                    required
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />

                <div className="grid grid-cols-2 gap-5">
                    <FormInput
                        label="Start Date"
                        type="month"
                        value={currentEducation?.startDate || ''}
                        onChange={(e) => handleEducationChange('startDate', e.target.value)}
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                    <FormInput
                        label="End Date"
                        type="month"
                        value={currentEducation?.endDate || ''}
                        onChange={(e) => handleEducationChange('endDate', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEducationForm(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={saveEducationEntry}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 shadow-sm"
                >
                    Save Education
                </Button>
            </div>
        </div>
    );

    // Enhanced Education List Item
    const EducationListItem = ({ education, index }: { education: Education, index: number }) => (
        <div className="p-5 border-2 border-gray-100 rounded-xl bg-white hover:border-red-50 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-xl font-bold text-gray-900">{education.degree}</h4>
                    <p className="text-gray-700 font-medium mt-1">
                        {education.university}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => editEducation(index)}
                        className="text-gray-600 hover:text-red-600 transition-colors p-1"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-gray-600 hover:text-red-600 transition-colors p-1"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-red-500" />
                    {education.startDate} - {education.endDate || 'Present'}
                </span>
                <span className="flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full text-red-700">
                    {education.educationLevel === 'highschool' && 'High School'}
                    {education.educationLevel === 'undergrad' && 'Undergraduate'}
                    {education.educationLevel === 'postgrad' && 'Postgraduate'}
                    {education.educationLevel === 'phd' && 'PhD'}
                </span>
            </div>
        </div>
    );

    // Calendar Icon Component (add this at the top of your file)
    const CalendarIcon = ({ className }: { className?: string }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );

    // Helper functions for date formatting
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

    return (
        <>
            <div className="mb-5 flex-1 w-full md:w-1/2">
                <span
                    onClick={() => setShowEducationPopup(true)}
                    className="cursor-pointer text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1.5 group"
                >
                    Check Out Educations
                    <span className="text-gray-500 group-hover:text-red-600 transition-colors">
                        ({educations.length})
                    </span>
                </span>
            </div>

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

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
    );
};

// Export the component
export default EducationManager;

// Also export the component itself so it can be used directly if needed
export { EducationManager };