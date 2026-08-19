import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Philosophy from "@/components/Philosophy";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Page frame — content sits between the fixed corner rails (logo/socials on
          the left, nav/Let's-talk on the right) on desktop; rule lines break out
          full-bleed. Mobile has no corners, so no gutter. */}
      <main className="md:px-28 lg:px-32">
        <Hero />
        <About />
        <Services />
        <Work />
        <Experience />
        <Philosophy />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
