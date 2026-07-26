export interface PixelVector {
  x: number;
  y: number;
}

export interface GiftParticle {
  delay: number;
  lifespan: number;
  velocity: PixelVector;
  acceleration: PixelVector;
  size: 4 | 6 | 8;
  colorIndex: 0 | 1 | 2;
}

export interface GiftParticleTrack {
  inputRange: number[];
  x: number[];
  y: number[];
  opacity: number[];
}

function seedFromString(value: string): number {
  let seed = 2166136261;
  for (const character of value) {
    seed ^= character.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function randomGenerator(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

/** 같은 선물상자는 같은 궤적을 재생해 스냅샷·디버깅이 재현 가능하다. */
export function createGiftParticles(key: string, count = 18): GiftParticle[] {
  const random = randomGenerator(seedFromString(key));
  return Array.from({ length: count }, (_, index) => {
    const angle = Math.PI * (1.12 + random() * 0.76);
    const speed = 168 + random() * 76;
    return {
      delay: 0.46 + random() * 0.08,
      lifespan: 0.32 + random() * 0.08,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 42
      },
      acceleration: { x: 0, y: 280 },
      size: [4, 6, 8][index % 3] as 4 | 6 | 8,
      colorIndex: (index % 3) as 0 | 1 | 2
    };
  });
}

function cluster(value: number): number {
  return Math.round(value / 2) * 2;
}

/** position + velocity + acceleration, lifespan alpha를 5개 픽셀 키프레임으로 샘플링한다. */
export function giftParticleTrack(particle: GiftParticle): GiftParticleTrack {
  const ages = [0, 0.18, 0.42, 0.7, 1];
  const end = particle.delay + particle.lifespan;
  const positions = ages.map((age) => {
    const time = age * particle.lifespan;
    return {
      x: cluster(particle.velocity.x * time + 0.5 * particle.acceleration.x * time * time),
      y: cluster(particle.velocity.y * time + 0.5 * particle.acceleration.y * time * time)
    };
  });
  return {
    inputRange: [0, particle.delay, ...ages.slice(1).map((age) => particle.delay + age * particle.lifespan), 1],
    x: [0, 0, ...positions.slice(1).map((position) => position.x), positions.at(-1)?.x ?? 0],
    y: [0, 0, ...positions.slice(1).map((position) => position.y), positions.at(-1)?.y ?? 0],
    opacity: [0, 0, 1, 0.78, 0.42, 0, 0]
  };
}
