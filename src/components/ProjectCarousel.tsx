import { useCallback, useState } from 'react'
import ProjectGalleryCard from './ProjectGalleryCard'
import ProjectLightbox from './ProjectLightbox'

interface Slide { src: string; caption: string }

export default function ProjectCarousel({ slides, title }: { slides: Slide[]; title: string }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [open, setOpen] = useState(false)
  const total = slides.length

  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }, [current])

  const go = useCallback((dir: number) => {
    setDirection(dir)
    setCurrent(i => (i + dir + total) % total)
  }, [total])

  const props = {
    slides,
    title,
    current,
    direction,
    onGoTo: goTo,
    onPrev: () => go(-1),
    onNext: () => go(1),
  }

  return (
    <>
      <ProjectGalleryCard {...props} onOpen={() => setOpen(true)} />
      <ProjectLightbox {...props} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
