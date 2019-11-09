import styles from "./styles.css";

import { h, VNode } from "preact";
import { useState } from "preact/hooks";
import classnames from "classnames";

import { Character } from "../../data/character/type";
import {
  getAvailableRoutesFromEndings,
  getEndingContentForRoute,
} from "../../data/ending";
import { Ending, OrderedRoute } from "../../data/ending/type";

type Props = {
  className?: string;
  characterA: Character;
  characterB: Character;
  characterASlug: string;
  characterBSlug: string;
  endings: Ending[];
};

export default function EndingsCard(props: Props): VNode<Props> {
  const {
    className = "",
    characterA,
    characterB,
    characterASlug,
    characterBSlug,
    endings,
  } = props;
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const { ASSETS_VERSION } = process.env;
  const availableRoutes = getAvailableRoutesFromEndings(endings);

  const selectedRoute = availableRoutes[selectedRouteIndex];
  const selectedEndingContent = getEndingContentForRoute(
    endings,
    selectedRoute,
  );

  let suffixA = "";
  if (
    selectedRoute === 0 &&
    (characterA === "Byleth M" || characterA === "Byleth F")
  ) {
    suffixA = "_n";
  }

  let suffixB = "";
  if (
    selectedRoute === 0 &&
    (characterB === "Byleth M" || characterB === "Byleth F")
  ) {
    suffixB = "_n";
  }

  const portraitAJPGs = availableRoutes.length
    ? [
        `/${characterASlug}${suffixA}_l@1x-${ASSETS_VERSION}.jpg`,
        `/${characterASlug}${suffixA}_l@2x-${ASSETS_VERSION}.jpg`,
        `/${characterASlug}${suffixA}_l@3x-${ASSETS_VERSION}.jpg`,
        `/${characterASlug}${suffixA}_l@4x-${ASSETS_VERSION}.jpg`,
      ]
    : [];
  const portraitAWEBPs = availableRoutes.length
    ? [
        `/${characterASlug}${suffixA}_l@1x-${ASSETS_VERSION}.webp`,
        `/${characterASlug}${suffixA}_l@2x-${ASSETS_VERSION}.webp`,
        `/${characterASlug}${suffixA}_l@3x-${ASSETS_VERSION}.webp`,
        `/${characterASlug}${suffixA}_l@4x-${ASSETS_VERSION}.webp`,
      ]
    : [];
  const portraitBJPGs = availableRoutes.length
    ? [
        `/${characterBSlug}${suffixB}_l@1x-${ASSETS_VERSION}.jpg`,
        `/${characterBSlug}${suffixB}_l@2x-${ASSETS_VERSION}.jpg`,
        `/${characterBSlug}${suffixB}_l@3x-${ASSETS_VERSION}.jpg`,
        `/${characterBSlug}${suffixB}_l@4x-${ASSETS_VERSION}.jpg`,
      ]
    : [];
  const portraitBWEBPs = availableRoutes.length
    ? [
        `/${characterBSlug}${suffixB}_l@1x-${ASSETS_VERSION}.webp`,
        `/${characterBSlug}${suffixB}_l@2x-${ASSETS_VERSION}.webp`,
        `/${characterBSlug}${suffixB}_l@3x-${ASSETS_VERSION}.webp`,
        `/${characterBSlug}${suffixB}_l@4x-${ASSETS_VERSION}.webp`,
      ]
    : [];

  return (
    <div className={classnames(styles.endingsCard, className)}>
      <div className={styles.left}>
        <div className={styles.character}>
          <PortraitPic
            character={characterA}
            portraitJPGs={portraitAJPGs}
            portraitWEBPs={portraitAWEBPs}
          />
          <Badge name={characterA} className={styles.badge} />
        </div>
        <div className={classnames(styles.character, styles.characterB)}>
          <PortraitPic
            character={characterB}
            className={styles.portraitPictureB}
            portraitJPGs={portraitBJPGs}
            portraitWEBPs={portraitBWEBPs}
          />
          <Badge
            name={characterB}
            className={classnames(styles.badge, styles.badgeB)}
          />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.routes}>
          {availableRoutes.map((route: OrderedRoute, index: number) => {
            const faction = getRouteFaction(route);
            const factionSrcSetWEBP = `/${faction}_emblem@1x-${ASSETS_VERSION}.webp 1x, /${faction}_emblem@2x-${ASSETS_VERSION}.webp 2x, /${faction}_emblem@3x-${ASSETS_VERSION}.webp 3x`;
            const factionSrcSetPNG = `/${faction}_emblem@1x-${ASSETS_VERSION}.png 1x, /${faction}_emblem@2x-${ASSETS_VERSION}.png 2x, /${faction}_emblem@3x-${ASSETS_VERSION}.png 3x`;

            return (
              <picture className={styles.factionPicture} key={route}>
                <source type="image/webp" srcSet={factionSrcSetWEBP} />
                <source type="image/png" srcSet={factionSrcSetPNG} />
                <img
                  alt={`${faction}`}
                  className={classnames(styles.factionImage, {
                    [styles.factionImageSelected]: selectedRouteIndex === index,
                  })}
                  srcSet={factionSrcSetPNG}
                  onClick={(): void => setSelectedRouteIndex(index)}
                />
              </picture>
            );
          })}
        </div>
        <div className={styles.content}>
          {selectedEndingContent != null
            ? selectedEndingContent
                .split("\n")
                .map((ending: string, index: number) => (
                  <div className={styles.ending} key={index}>
                    {ending}
                  </div>
                ))
            : null}
          <div className={styles.contentBackground} />
        </div>
      </div>
    </div>
  );
}

type PortraitPicProps = {
  character: Character;
  className?: string;
  portraitJPGs: string[];
  portraitWEBPs: string[];
};

function PortraitPic(props: PortraitPicProps): VNode<PortraitPicProps> {
  const { className, character, portraitJPGs, portraitWEBPs } = props;

  if (portraitJPGs.length === 0 || portraitWEBPs.length === 0) {
    return (
      <div className={classnames(styles.portraitPicture, className)}></div>
    );
  }

  return (
    <picture className={classnames(styles.portraitPicture, className)}>
      <source
        type="image/webp"
        media="(min-width: 1200px)"
        srcSet={portraitWEBPs[3]}
      />
      <source
        type="image/jpeg"
        media="(min-width: 1200px)"
        srcSet={portraitJPGs[3]}
      />
      <source
        type="image/webp"
        media="(min-width: 992px)"
        srcSet={`${portraitWEBPs[1]} 1x, ${portraitWEBPs[3]} 2x`}
      />
      <source
        type="image/jpeg"
        media="(min-width: 992px)"
        srcSet={`${portraitJPGs[1]} 1x, ${portraitJPGs[3]} 2x`}
      />
      <source
        type="image/webp"
        media="(min-width: 768px)"
        srcSet={`${portraitWEBPs[1]} 1x, ${portraitWEBPs[2]} 2x, ${portraitWEBPs[3]} 3x`}
      />
      <source
        type="image/jpeg"
        media="(min-width: 768px)"
        srcSet={`${portraitJPGs[1]} 1x, ${portraitJPGs[2]} 2x, ${portraitJPGs[3]} 3x`}
      />
      <source
        type="image/webp"
        srcSet={`${portraitWEBPs[0]} 1x, ${portraitWEBPs[1]} 2x, ${portraitWEBPs[2]} 3x`}
      />
      <source
        type="image/jpeg"
        srcSet={`${portraitJPGs[0]} 1x, ${portraitJPGs[1]} 2x, ${portraitJPGs[2]} 3x`}
      />
      <img
        alt={`${character} Portrait`}
        className={styles.portraitImage}
        src={portraitJPGs[3]}
      />
    </picture>
  );
}

type BadgeProps = {
  className?: string;
  name: string;
};

function Badge(props: BadgeProps): VNode<BadgeProps> {
  const { className, name } = props;

  return (
    <div className={classnames(styles.badge, className)}>
      <SVGBadge />
      <span className={styles.badgeText}>{name}</span>
    </div>
  );
}

function SVGBadge(): VNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 318 42"
      className={styles.badgeSvg}
    >
      <defs>
        <radialGradient r="90%" id="gradient">
          <stop offset="0%" style={{ stopColor: "#3c2e4f" }} />
          <stop offset="100%" style={{ stopColor: "#0d0a11" }} />
        </radialGradient>
      </defs>
      <g>
        <path
          d="M1.75 21.25L20 2.75h278.62L317.5 20.5 299 39.37H19.62L1.75 21.25z"
          strokeOpacity="null"
          strokeWidth="3"
          stroke="#aba38c"
          fill="url(#gradient)"
        />
      </g>
    </svg>
  );
}

function getRouteFaction(route: OrderedRoute): string {
  if (route === 0) {
    return "empire";
  } else if (route === 1) {
    return "holy";
  } else if (route === 2) {
    return "alliance";
  } else {
    return "church";
  }
}
