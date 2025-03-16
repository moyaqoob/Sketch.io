import Footer from "@/components/footer";
import Header from "@/components/header";
import siteMetadata from "@/data/siteMetadata";
import { knewave } from "@/data/fonts";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mt-24 flex justify-center  text-primary-darker mb-20">
        <section className="md:max-w-4xl max-w-xl text-center mt-18 md:mt-28">
          {/* Headline */}
          <h1 className="text-5xl font-extrabold md:text-[56px] text-center lg:flex-row flex-col flex justify-between items-center gap-3 tracking-wide">
            <span>Online </span>
            <span className={`${knewave.className}  font-light`}>
              Whiteboard{" "}
            </span>
            <span>Made Simple </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg md:text-xl text-gray-700 text-center">
            {siteMetadata.slogan} with{" "}
            <span className="font-bold">{siteMetadata.header}</span>.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-8">
            <a
              href="#"
              className="px-6 py-3 hover:bg-primary tracking-wider text-white font-bold rounded-lg bg-primary-darker transition text-center"
            >
              Start Drawing Now
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
