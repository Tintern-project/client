import Image from "next/image";
import ProfileForm from "@/app/profile/components/profile-form";

export default function ProfileLayout() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="grid md:grid-cols-2 overflow-hidden rounded-xl max-w-7xl w-full mx-auto bg-[#222] shadow-xl">
        <div className="h-full">
          <Image
            src="/hero.jpg"
            alt="Profile background"
            width={700}
            height={900}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="bg-[#f0f0f0] text-black p-10 lg:p-14">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
