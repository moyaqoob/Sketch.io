import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import HeroSection from "@/components/landing-page/hero-section";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mt-24 flex justify-center  text-secondary mb-20">
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}
