"use-client"
import Image from "next/image"

export default function SizeGuide(){
const sizes = [
  { idx: 0, name: "petite", size: "xs/s", image:"/images/size-guide/petite.jpg" },
  { idx: 1, name: "one size", size: "s/m - m/l", image:"/images/size-guide/onesize.jpg" },
  { idx: 2, name: "mid size", size: "l/xl - xl/2xl", image:"/images/size-guide/midsize.jpg" },
  { idx: 3, name: "curved", size: "3xl - 4xl", image:"/images/size-guide/curved.jpg" },
]

  return (
    <section className="py-30 bg-background" id="new">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-md uppercase tracking-[0.3em] text-muted-foreground mb-3">
          The Size Guide
          </p>
          <h2 className="text-sm text-foreground tracking-tight">
          your fit, figured out.
          </h2>
        </div>

        {/* Sizes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sizes.map((size) => (
            <div key={size.idx} className="group cursor-pointer">
              {/* Size image */}
              <div className="relative aspect-[4/4] mb-4 overflow-hidden">
                <Image
                  src={size.image}
                  alt={size.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Size info */}
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {size.name ?? "Uncategorized"}
                </p>
                <p className="mt-1 text-sm text-foreground">{size.size}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20">
          <p className="mb-4 text-xl text-semibold">step one</p>
          <p className="ml-2 text-muted-foreground">
            start with the fit.<br />
            check whether the product is designed to fit regular or oversized.<br />
            regular fit → take your usual size<br />
            oversized fit → take your usual size, or size down for a closer fit
          </p>
          <p className="mt-10 mb-4 text-xl text-semibold">step two</p>

          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/4] mb-4 overflow-hidden">
              <Image
                src={'/images/size-guide/sizechart.jpg'}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <p className="text-muted-foreground">
              check the measurements.<br />
              use the illustration and size chart to see how each product is measured, so you know exactly what to expect.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}