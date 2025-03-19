import Image from "next/image";
import Link from "next/link";

export default function MainContentSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">
          <span className="text-[#F5F5F5]">SPEND LESS TIME </span>
          <span className="text-[#BA1B1B]">SEARCHING</span>
          <span className="text-[#F5F5F5]"> FOR JOBS</span>
        </h2>
        {/* Grid: 3 columns, 2 rows on large screens */}
        <div className="min-h-[400px] md:min-h-[500px] lg:min-h-[550px] max-w-screen-xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 lg:grid-rows-2">
          {/* Card 1: Top-left */}
          <div className="feature-card bg-[#963434] rounded-xl p-8 flex flex-col gap-y-6 lg:col-start-1 lg:row-start-1">
            <h3 className="text-2xl font-medium mb-2">
              Tintern&apos;s easy swiping mechanism saves
            </h3>
            <p className="text-4xl font-bold">30 Hours A Week</p>
          </div>

          {/* Card 2: Middle (spans 2 rows) */}
          <div className="feature-card relative bg-[#1E1E1E] rounded-xl overflow-hidden lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <Image
              src="/testimonial.png"
              alt="Kendall Roy Testimonial"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent flex flex-col justify-end p-8">
              <div className="relative z-10">
                <p className="text-xl italic mb-4">
                  &quot;Tintern helped me find my dream job&quot;
                </p>
                <p className="text-[#F5F5F5]/80">— Kendall Roy, 36</p>
              </div>
            </div>
          </div>

          {/* Card 3: Top-right */}
          <div className="feature-card relative bg-[#1E1E1E] rounded-xl overflow-hidden lg:col-start-3 lg:row-start-1">
            <Image
              src="/sunglassGuy.png"
              alt="Person with sunglasses"
              fill
              className="object-cover"
            />
          </div>

          {/* Card 4: Bottom-left */}
          <div className="feature-card relative bg-[#1E1E1E] rounded-xl overflow-hidden lg:col-start-1 lg:row-start-2">
            <Image
              src="/salute.png"
              alt="Tintern Feature"
              fill
              className="object-cover"
            />
          </div>

          {/* Card 5: Bottom-right */}
          <div className="feature-card relative bg-[#BA1B1B] rounded-xl justify-center p-7 flex flex-col lg:col-start-3 lg:row-start-2">
          <div className="flex flex-col gap-y-9 text-center">
            <p className="text-4xl font-bold">Hundreds</p>
            <p className="text-xl font-medium">Of Students recommend using Tintern for Job Searching</p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
