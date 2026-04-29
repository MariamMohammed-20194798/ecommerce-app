import Image from "next/image";

export default function OurStoryPage() {
  return (
    <div className="bg-background py-16 mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          
          {/* Image */}
          <div className="w-full">
            <Image
              src="/images/our-story.jpg"
              alt="Our Story"
              width={600}
              height={400}
              className="w-full h-[700px] object-contain"
              priority
            />
          </div>

          {/* Text Content */}
          <div className="max-w-xl">
            <h2 className="text-4xl font-semibold mb-6">
              Our Story
            </h2>

            <div className="space-y-5 text-sm leading-7 text-gray-800">
              <p>
                It started with a simple frustration — finding pieces that felt
                just right. Not too bold, not too plain. From everyday tees to
                statement accessories, the search often felt longer than it
                should.
              </p>

              <p>
                Instead of settling, we decided to create a space where every
                woman could find pieces that truly complete her look — easily
                and beautifully.
              </p>

              <p>
                Our collections bring together accessories, bags, and essentials
                designed to mix effortlessly. Whether you&apos;re dressing for a
                casual day or something special, every detail matters.
              </p>

              <p>
                We believe style lives in the small things — the bag you carry,
                the pieces you layer, the confidence you feel.
              </p>

              <p>
                We hope you enjoy your journey with us — creating looks that feel
                completely yours.
              </p>

              <p className="pt-4">
                With love, <br />
                <span className="font-medium">Women&apos;s</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}