import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";

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
