import React from "react";
import { Composition, staticFile } from "remotion";
import { ProductPromoComposition } from "./Composition";
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

const getAudioDuration = async (src: string): Promise<number> => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const durationInSeconds = await input.computeDuration();
  return durationInSeconds;
};

export const RemotionRoot: React.FC = () => {
  const FPS = 30;

  return (
    <Composition
      id="ProductPromo"
      component={ProductPromoComposition}
      durationInFrames={540} // Fallback duration (~18s)
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        audioSrc: "audio.mp3",
      }}
      calculateMetadata={async ({ props }) => {
        try {
          const audioUrl = staticFile(props.audioSrc);
          const durationInSeconds = await getAudioDuration(audioUrl);
          const totalFrames = Math.ceil((durationInSeconds + 1.5) * FPS);

          return {
            durationInFrames: totalFrames,
            defaultOutName: "alangkart-saas-promo.mp4",
          };
        } catch (err) {
          console.warn("Using default durationInFrames:", err);
          return {
            durationInFrames: 540,
            defaultOutName: "alangkart-saas-promo.mp4",
          };
        }
      }}
    />
  );
};
