import { VIDEO_LINKS } from "@/constants";
import { PropsWithChildren, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

interface BentoTiltProps {
  className?: string;
}

const BentoTilt = ({
  children,
  className = "",
}: PropsWithChildren<BentoTiltProps>) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;

    setTransformStyle(newTransform);
  };
  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  src: string;
  title: React.ReactNode;
  description?: string;
}

const BentoCard = ({ src, title, description }: BentoCardProps) => {
  return (
    <article className="relative size-full overflow-hidden rounded-md">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute top-0 left-0 size-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/40 to-transparent" />

      <div className="relative z-10 flex size-full flex-col justify-start p-6 text-blue-50 lg:p-8">
        <div className="max-w-xs lg:max-w-sm">
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-4 max-w-80 text-lg leading-snug text-blue-50/95">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export const Features = () => {
  return (
    <section className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the Metagame Layer
          </p>

          <p className="font-circular-web max-w-md text-lg text-blue-50 opacity-50">
            Immerse yourself in a rich and ever-expanding universe where a
            vibrant array of products converge into an interconnected overlay
            experience on your world.
          </p>
        </div>

        <BentoTilt className="border-hsla relative mb-7 h-66 w-full overflow-hidden rounded-md md:h-[45vh]">
          <BentoCard
            src={VIDEO_LINKS.feature1}
            title={
              <>
                radia<b>n</b>t
              </>
            }
            description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
          />
        </BentoTilt>

        <div
          id="nexus"
          className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:grid-rows-[31rem_24rem_18rem]"
        >
          <BentoTilt className="bento-tilt_1 min-h-[34rem] lg:row-span-2 lg:min-h-0">
            <BentoCard
              src={VIDEO_LINKS.feature2}
              title={
                <>
                  zig<b>m</b>a
                </>
              }
              description="An anime and gaming-inspired NFT collection - the IP primed for expansion."
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 min-h-[20rem] lg:min-h-0">
            <BentoCard
              src={VIDEO_LINKS.feature3}
              title={
                <>
                  n<b>e</b>xus
                </>
              }
              description="A gamified social hub, adding a new dimension of play to social interaction for Web3 communities."
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 min-h-[20rem] lg:min-h-0">
            <BentoCard
              src={VIDEO_LINKS.feature4}
              title={
                <>
                  az<b>u</b>l
                </>
              }
              description="A cross-world AI Agent - elevating your gameplay to be more fun and productive."
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_2 min-h-[16rem] lg:min-h-0">
            <div className="flex size-full flex-col justify-between bg-linear-to-r from-[#5a15ff] to-[#7e52ff] p-6 lg:p-8">
              <h1 className="bento-title special-font max-w-56 text-black">
                more
                <br />
                co<b>m</b>ing
                <br />
                so<b>o</b>n!
              </h1>

              <TiLocationArrow className="m-3 self-end text-6xl text-black lg:text-7xl" />
            </div>
          </BentoTilt>

          <BentoTilt className="bento-tilt_2 min-h-[16rem] lg:min-h-0">
            <video
              src={VIDEO_LINKS.feature5}
              loop
              muted
              autoPlay
              className="size-full object-cover object-center"
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};
