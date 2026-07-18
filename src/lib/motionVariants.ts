export const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
}
