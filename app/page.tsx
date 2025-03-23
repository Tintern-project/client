import Image from "next/image";
import Link from "next/link";
import LandingCore from "./components/LandingCore";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1E1E1E]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Tintern Hero"
            fill
            priority
            className="object-cover brightness-90"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in-up">
              CHANGE HOW YOU <br />
              THINK ABOUT <br />
              APPLICATIONS
            </h1>
            <p className="text-xl md:text-2xl mt-6 text-[#F5F5F5]/90 animate-fade-in-up animation-delay-200">
              Just get the job
            </p>
            <div className="mt-8 animate-fade-in-up animation-delay-300">
              <Link
                href="/signup"
                className="btn-primary bg-[#C00F0C] hover:bg-[#963434]"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <LandingCore />
    </main>
  );
}
