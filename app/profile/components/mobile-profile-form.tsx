import { FormInput } from "@/app/profile/components/ui/form-input";
import { FormSelect } from "@/app/profile/components/ui/form-select";
import { Button } from "@/app/profile/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function MobileProfileForm() {
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
          <span className="text-xl">Hi Kendall</span>
        </div>
        <button className="text-white p-2">
          <Menu size={28} />
        </button>
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
            placeholder="John Doe"
            defaultValue="John Doe"
            className="rounded-xl h-12 text-base"
          />
        </div>

        <div>
          <label htmlFor="mobile-email" className="block text-white mb-2">
            Email
          </label>
          <FormInput
            id="mobile-email"
            placeholder="Example@gmail.com"
            type="email"
            className="rounded-xl h-12 text-base"
          />
        </div>

        <div>
          <label htmlFor="mobile-dob" className="block text-white mb-2">
            Date Of Birth
          </label>
          <FormSelect id="mobile-dob" className="rounded-xl h-12 text-base">
            <option>Add / Update Preexisting One</option>
            <option>January 1, 1990</option>
            <option>January 1, 1991</option>
            <option>January 1, 1992</option>
          </FormSelect>
        </div>

        <div>
          <label htmlFor="mobile-cv" className="block text-white mb-2">
            CV
          </label>
          <FormSelect id="mobile-cv" className="rounded-xl h-12 text-base">
            <option>Choose From Uploaded Ones</option>
            <option>resume_2023.pdf</option>
            <option>cv_latest.pdf</option>
          </FormSelect>
        </div>

        <div className="flex justify-center mt-6">
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 px-8 text-base">
            Upload a CV
          </Button>
        </div>

        <div className="pt-8">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-lg">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
