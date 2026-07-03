import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { TiLocationArrow } from "react-icons/ti";

import { LINKS, NAV_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";

import { Button } from "./button";

export const Navbar = () => {
  const audioElementRef = useRef<HTMLAudioElement>(null);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prevAudioPlaying) => !prevAudioPlaying);
    setIsIndicatorActive((prevIndicatorActive) => !prevIndicatorActive);
  };

  useEffect(() => {
    if (isAudioPlaying) void audioElementRef.current?.play();
    else audioElementRef.current?.pause();
  }, [isAudioPlaying]);

  return (
    <header className="fixed rounded-b-3xl inset-x-0 top-0 z-50 w-full bg-black/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[100vw] px-4 sm:px-6">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-7">
            <a href="#hero" className="transition hover:opacity-75">
              <img src="/img/logo.png" alt="Logo" className="w-10" />
            </a>

            <Button
              id="product-button"
              rightIcon={TiLocationArrow}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            >
              Products
            </Button>
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {NAV_ITEMS.map(({ label, href }) => (
                <a key={href} href={href} className="nav-hover-btn">
                  {label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudioIndicator}
                className="ml-10 flex items-center space-x-1 p-2 transition hover:opacity-75"
                title="Play Audio"
              >
                <audio
                  ref={audioElementRef}
                  src="/audio/loop.mp3"
                  className="hidden"
                  loop
                />

                {Array(4)
                  .fill("")
                  .map((_, i) => {
                    return (
                      <div
                        key={i + 1}
                        className={cn(
                          "indicator-line",
                          isIndicatorActive && "active"
                        )}
                        style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                      />
                    );
                  })}
              </button>

              <a
                href={LINKS.sourceCode}
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:opacity-75"
                title="Source Code"
              >
                <FaGithub className="size-5 text-white" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
