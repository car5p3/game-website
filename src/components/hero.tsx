import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useMemo, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import { Button } from "./button";
import { VIDEO_LINKS } from "@/constants";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const VIDEO_KEYS = useMemo(
    () => ["hero1", "hero2", "hero3", "hero4"] as const,
    []
  );

  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const frameRef = useRef<HTMLDivElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const transitionVideoRef = useRef<HTMLVideoElement>(null);
  const loadedVideoSourcesRef = useRef(new Set<string>());

  const totalVideos = VIDEO_KEYS.length;
  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  const getVideoSrc = (i: number) => {
    const key = VIDEO_KEYS[i - 1];
    return VIDEO_LINKS[key];
  };

  const handleMiniVideoClick = () => {
    if (hasClicked) return;

    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };

  const handleVideoLoad = (src: string) => {
    if (loadedVideoSourcesRef.current.has(src)) return;

    loadedVideoSourcesRef.current.add(src);
    setLoadedVideos(loadedVideoSourcesRef.current.size);
  };

  useEffect(() => {
    if (loadedVideos >= totalVideos) {
      setIsLoading(false);
    }
  }, [loadedVideos, totalVideos]);

  useGSAP(
    () => {
      if (!hasClicked || !transitionVideoRef.current || !previewVideoRef.current) {
        return;
      }

      const transitionVideo = transitionVideoRef.current;
      const previewVideo = previewVideoRef.current;

      gsap.killTweensOf([transitionVideo, previewVideo]);
      gsap.set(transitionVideo, {
        visibility: "visible",
        scale: 0.5,
        width: "16rem",
        height: "16rem",
      });

      gsap.timeline({
        defaults: { ease: "power1.inOut" },
        onStart: () => {
          transitionVideo.currentTime = 0;
          void transitionVideo.play();
        },
        onComplete: () => {
          gsap.set(transitionVideo, { visibility: "hidden" });
          setHasClicked(false);
        },
      })
        .to(transitionVideo, {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
        })
        .from(
          previewVideo,
          {
            transformOrigin: "center center",
            scale: 0,
            duration: 1,
          },
          0
        );
    },
    { dependencies: [currentIndex, hasClicked], revertOnUpdate: true }
  );

  useGSAP(() => {
    if (!frameRef.current) return;

    gsap.set(frameRef.current, {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from(frameRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: frameRef.current,
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <section id="hero" className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-100 h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      <div
        ref={frameRef}
        className="bg-blue-75 relative z-10 h-dvh w-screen overflow-hidden rounded-lg"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVideoClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={previewVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
                loop
                muted
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={() => handleVideoLoad(getVideoSrc(upcomingVideoIndex))}
              />
            </div>
          </div>

          <video
            ref={transitionVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={() => handleVideoLoad(getVideoSrc(currentIndex))}
          />

          <video
            key={currentIndex}
            src={getVideoSrc(currentIndex)}
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 size-full object-cover object-center"
            onLoadedData={() => handleVideoLoad(getVideoSrc(currentIndex))}
          />

          {VIDEO_KEYS.map((key, index) => {
            const src = VIDEO_LINKS[key];

            if (index + 1 === currentIndex || index + 1 === upcomingVideoIndex) {
              return null;
            }

            return (
              <video
                key={src}
                src={src}
                preload="auto"
                className="hidden"
                muted
                onLoadedData={() => handleVideoLoad(src)}
              />
            );
          })}
        </div>

        <h1 className="special-font hero-heading text-blue-75 absolute right-5 bottom-5 z-40">
          G<b>a</b>ming
        </h1>

        <div className="absolute top-0 left-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              Redefi<b>n</b>ed
            </h1>

            <p className="font-robert-regular mb-5 max-w-64 text-blue-100">
              Enter the Metagame Layer <br />
              Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              leftIcon={TiLocationArrow}
              containerClass="bg-yellow-300 flex-center gap-1"
            >
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute right-5 bottom-5 text-black">
        G<b>a</b>ming
      </h1>
    </section>
  );
};
