import { NewComposition } from "./NewComposition";
import React from "react";
import { Composition } from "remotion";
import { ProductPromoComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  const FPS = 30;

  return (
    <>
      <Composition
        id="ProductPromo"
        component={ProductPromoComposition}
        durationInFrames={576}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          audioSrc: "audio.mp3",
        }}
        calculateMetadata={async () => ({
          durationInFrames: 576,
          defaultOutName: "stylish-creation-product-promo.mp4",
        })}
      />
      <Composition
        id="NewComposition"
        component={NewComposition}
        durationInFrames={576}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
