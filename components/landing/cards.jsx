'use client';

import { useEffect, useRef, useState } from 'react';

const ROOT = 'relative touch-pan-y [-webkit-tap-highlight-color:transparent]';
const CARD =
  'absolute top-1/2 left-1/2 aspect-square w-[var(--bounce-cards-size)] overflow-hidden rounded-[var(--bounce-cards-radius)] border-[length:var(--bounce-cards-border)] border-solid border-[color:var(--bounce-cards-border-color)] [background:var(--bounce-cards-border-color)] [box-shadow:var(--bounce-cards-shadow)] [transform:translate(-50%,-50%)_scale(0)] transition-shadow duration-300 will-change-transform data-[active]:[box-shadow:var(--bounce-cards-shadow-active)]';
const CLICKABLE =
  'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--bounce-cards-border-color)]';
const IMG = 'pointer-events-none block h-full w-full select-none';
const PATTERN = [1, 0.5, -0.3, -1, 0.2, 0.75, -0.6, 0.35, -0.85, 0.1];

const MOBILE_QUERY = '(max-width: 767px)';
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1200px)';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// SSR-safe. Returns 'mobile' | 'tablet' | 'desktop' and updates live on resize / rotation
function useDevice() {
  const [device, setDevice] = useState('desktop');

  useEffect(() => {
    const mobileMql = window.matchMedia(MOBILE_QUERY);
    const tabletMql = window.matchMedia(TABLET_QUERY);
    const update = () =>
      setDevice(mobileMql.matches ? 'mobile' : tabletMql.matches ? 'tablet' : 'desktop');

    update();
    mobileMql.addEventListener('change', update);
    tabletMql.addEventListener('change', update);
    return () => {
      mobileMql.removeEventListener('change', update);
      tabletMql.removeEventListener('change', update);
    };
  }, []);

  return device;
}

// Viewport width (0 on the server), used to make sure the cards never overflow the screen
function useViewportWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return width;
}

const parseTransform = value => {
  if (typeof value !== 'string') return null;
  const rotate = value.match(/rotate\(\s*(-?[\d.]+)deg\s*\)/);
  const translate = value.match(/translate\(\s*(-?[\d.]+)px(?:\s*,\s*(-?[\d.]+)px)?\s*\)/);
  return {
    x: translate ? Number(translate[1]) : 0,
    y: translate && translate[2] ? Number(translate[2]) : 0,
    rotate: rotate ? Number(rotate[1]) : 0
  };
};

const toCard = item =>
  typeof item === 'string' ? { src: item, alt: '' } : { src: item?.src, alt: item?.alt ?? '' };

export default function BounceCards({
  images = [
    '/photos/pexels-pixabay-221043.jpg',
    '/photos/pexels-alphatradezone-5831517.jpg',
    '/photos/pexels-silverkblack-39219380.jpg',
    '/photos/pexels-cottonbro-5081916.jpg',
    '/photos/03a29d5e-e725-4bc0-8c80-d3217c58d324.png',
    '/photos/cd5285dc-c0d1-4f27-87ea-437c305429a8.png'
  ],
  className = '',
  style,
  containerWidth = 400,
  containerHeight = 400,
  cardSize = 200,
  spread = 80,
  rotation = 10,
  arc = 0,
  animationDelay = 0.5,
  animationStagger = 0.06,
  bounciness = 0.6,
  enableHover = true,
  pushDistance = 160,
  hoverScale = 1.06,
  borderWidth = 5,
  borderColor = '#ffffff',
  radius = 25,
  shadow = true,
  mobileScale = 0.35, // phones   (≤ 767px)   - 1 = same as desktop
  tabletScale = 0.45, //  tablets  (768-1023px)
  autoFit = true, //     shrink further if the cards would overflow the screen
  fitGutter = 16, //     side padding (px) kept free when autoFit is on
  transformStyles,
  onCardClick
}) {
  const device = useDevice();
  const viewportWidth = useViewportWidth();

  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const wakeRef = useRef(null);
  const cards = images.map(toCard);
  const count = cards.length;
  const middle = (count - 1) / 2;
  const reach = Math.max(1, middle);

  // 1) layout at desktop size (scale = 1)
  const baseSlots = cards.map((_, i) => {
    const custom = transformStyles ? parseTransform(transformStyles[i]) : null;
    if (custom) return custom;
    const offset = i - middle;
    return {
      x: offset * spread,
      y: arc * (offset / reach) ** 2,
      rotate: rotation * PATTERN[i % PATTERN.length]
    };
  });

  // 2) pick the scale for the current device
  let k = device === 'mobile' ? mobileScale : device === 'tablet' ? tabletScale : 1;

  // 3) auto-fit: never let the card row be wider than the screen
  if (autoFit && device !== 'desktop' && viewportWidth > 0) {
    const xs = baseSlots.map(slot => slot.x);
    const rowWidth = Math.max(...xs) - Math.min(...xs) + cardSize;
    const available = viewportWidth - fitGutter * 2;
    if (rowWidth > 0) k = Math.min(k, available / rowWidth);
  }
  k = clamp(k, 0.1, 1);

  // 4) apply the scale (rotation stays the same)
  const slots = baseSlots.map(slot => ({ x: slot.x * k, y: slot.y * k, rotate: slot.rotate }));

  const settings = {
    slots,
    cardSize: Math.max(10, cardSize * k),
    delay: Math.max(0, animationDelay),
    stagger: Math.max(0, animationStagger),
    bounciness: clamp(bounciness, 0, 1),
    enableHover,
    pushDistance: pushDistance * k,
    hoverScale: clamp(hoverScale, 0.5, 2),
    clickable: typeof onCardClick === 'function'
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const clickRef = useRef(onCardClick);
  clickRef.current = onCardClick;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const bodies = [];
    const state = { hovered: -1, time: 0, layer: -1 };
    let raf = 0;
    let last = performance.now();
    let alive = true;

    const body = i => {
      if (!bodies[i]) {
        const slot = settingsRef.current.slots[i] ?? { x: 0, y: 0, rotate: 0 };
        bodies[i] = {
          x: slot.x,
          y: slot.y,
          rotate: slot.rotate,
          scale: reduce ? 1 : 0,
          vx: 0,
          vy: 0,
          vr: 0,
          vs: 0,
          born: state.time
        };
      }
      return bodies[i];
    };

    const step = (value, velocity, target, stiffness, damping, dt) => {
      const next = velocity + ((target - value) * stiffness - velocity * damping) * dt;
      return [value + next * dt, next];
    };

    const frame = now => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
      last = now;
      state.time += dt;

      const hovered = s.enableHover ? state.hovered : -1;
      const popStiffness = 170;
      const popDamping = 2 * (1 - 0.85 * s.bounciness) * Math.sqrt(popStiffness);
      const moveStiffness = 210;
      const moveDamping = 2 * (reduce ? 1 : 0.72) * Math.sqrt(moveStiffness);
      const substeps = Math.ceil(dt / (1 / 240));
      const h = dt / substeps;
      let moving = 0;

      for (let i = 0; i < s.slots.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const card = body(i);
        const slot = s.slots[i];
        const appeared = reduce || state.time - card.born >= s.delay + i * s.stagger;
        let targetX = slot.x;
        let targetY = slot.y;
        let targetRotate = slot.rotate;
        let targetScale = appeared ? 1 : 0;
        if (hovered >= 0 && appeared) {
          if (i === hovered) {
            targetY = slot.y - s.cardSize * 0.04;
            targetRotate = 0;
            targetScale = s.hoverScale;
          } else {
            targetX = slot.x + Math.sign(i - hovered) * s.pushDistance;
          }
        }
        for (let n = 0; n < substeps; n++) {
          [card.x, card.vx] = step(card.x, card.vx, targetX, moveStiffness, moveDamping, h);
          [card.y, card.vy] = step(card.y, card.vy, targetY, moveStiffness, moveDamping, h);
          [card.rotate, card.vr] = step(card.rotate, card.vr, targetRotate, moveStiffness, moveDamping, h);
          if (reduce) {
            card.scale = targetScale;
            card.vs = 0;
          } else {
            [card.scale, card.vs] = step(card.scale, card.vs, targetScale, popStiffness, popDamping, h);
          }
        }
        moving +=
          Math.abs(card.vx) +
          Math.abs(card.vy) +
          Math.abs(card.vr) +
          Math.abs(card.vs) * 100 +
          Math.abs(targetX - card.x) +
          Math.abs(targetY - card.y) +
          Math.abs(targetRotate - card.rotate) +
          Math.abs(targetScale - card.scale) * 100 +
          (appeared ? 0 : 1);
        el.style.transform = `translate(-50%, -50%) translate3d(${card.x.toFixed(2)}px, ${card.y.toFixed(2)}px, 0) rotate(${card.rotate.toFixed(3)}deg) scale(${Math.max(0, card.scale).toFixed(4)})`;
      }

      if (state.layer !== hovered) {
        state.layer = hovered;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.zIndex = i === hovered ? String(s.slots.length + 1) : String(i + 1);
          el.toggleAttribute('data-active', i === hovered);
        });
      }

      if (moving > 0.02) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const pick = event => {
      const s = settingsRef.current;
      const rect = root.getBoundingClientRect();
      const px = event.clientX - rect.left - rect.width / 2;
      const py = event.clientY - rect.top - rect.height / 2;
      let best = -1;
      let distance = Infinity;
      s.slots.forEach((slot, i) => {
        const gap = Math.abs(px - slot.x);
        if (gap < distance) {
          distance = gap;
          best = i;
        }
      });
      if (best < 0) return -1;
      const slot = s.slots[best];
      const half = s.cardSize / 2;
      if (Math.abs(py - slot.y) > half + 12 || distance > half + 12) return -1;
      if (state.hovered >= 0 && state.hovered !== best) {
        const current = s.slots[state.hovered];
        if (current && Math.abs(px - current.x) - distance < 6) return state.hovered;
      }
      return best;
    };

    const onMove = event => {
      const next = pick(event);
      if (next !== state.hovered) {
        state.hovered = next;
        wake();
      }
    };
    const onLeave = () => {
      if (state.hovered !== -1) {
        state.hovered = -1;
        wake();
      }
    };
    const onClick = event => {
      const index = pick(event);
      if (index < 0) return;
      const card = bodies[index];
      if (card && !reduce) card.vs -= 2.2;
      wake();
      clickRef.current?.(index);
    };
    const onFocus = event => {
      const index = cardRefs.current.indexOf(event.target);
      if (index >= 0) {
        state.hovered = index;
        wake();
      }
    };
    const onKey = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const index = cardRefs.current.indexOf(event.target);
      if (index < 0 || !settingsRef.current.clickable) return;
      event.preventDefault();
      if (bodies[index] && !reduce) bodies[index].vs -= 2.2;
      wake();
      clickRef.current?.(index);
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('click', onClick);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('focusout', onLeave);
    root.addEventListener('keydown', onKey);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerdown', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('click', onClick);
      root.removeEventListener('focusin', onFocus);
      root.removeEventListener('focusout', onLeave);
      root.removeEventListener('keydown', onKey);
    };
  }, []);

  // re-wake the loop whenever props / screen size change
  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div
      ref={rootRef}
      className={`${ROOT}${className ? ` ${className}` : ''}`}
      style={{
        width: containerWidth * k,
        height: containerHeight * k,
        '--bounce-cards-size': `${settings.cardSize}px`,
        '--bounce-cards-border': `${Math.max(0, borderWidth * (device === 'desktop' ? 1 : Math.max(k, 0.6)))}px`,
        '--bounce-cards-border-color': borderColor,
        '--bounce-cards-radius': `${Math.max(0, radius * k)}px`,
        '--bounce-cards-shadow': shadow
          ? '0 1px 2px rgba(0, 0, 0, 0.12), 0 10px 28px -6px rgba(0, 0, 0, 0.32)'
          : 'none',
        '--bounce-cards-shadow-active': shadow
          ? '0 2px 4px rgba(0, 0, 0, 0.14), 0 22px 44px -10px rgba(0, 0, 0, 0.42)'
          : 'none',
        ...style
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          ref={el => {
            cardRefs.current[i] = el;
          }}
          className={settings.clickable ? `${CARD} ${CLICKABLE}` : CARD}
          style={{ zIndex: i + 1 }}
          {...(settings.clickable
            ? { role: 'button', tabIndex: 0, 'aria-label': card.alt || `Card ${i + 1}` }
            : null)}
        >
          {card.src && <img className={IMG} src={card.src} alt={card.alt} draggable={false} />}
        </div>
      ))}
    </div>
  );
}