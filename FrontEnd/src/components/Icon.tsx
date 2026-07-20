import type { ReactNode, SVGProps } from 'react'

export type IconName = 'alert' | 'arrow-right' | 'building' | 'chart' | 'check' | 'chevron-down' | 'clock' | 'close' | 'compass' | 'compare' | 'file' | 'filter' | 'heart' | 'help' | 'history' | 'home' | 'info' | 'key' | 'map' | 'menu' | 'message' | 'minus' | 'plus' | 'renovation' | 'search' | 'settings' | 'shield' | 'star' | 'user' | 'verified'

const paths: Record<IconName, ReactNode> = {
  alert: <><path d='M10.3 3.4 2.6 18a2 2 0 0 0 1.8 3h15.2a2 2 0 0 0 1.8-3L13.7 3.4a2 2 0 0 0-3.4 0Z' /><path d='M12 9v4m0 4h.01' /></>,
  'arrow-right': <><path d='M5 12h14' /><path d='m14 7 5 5-5 5' /></>,
  building: <><path d='M4 21V5l8-3 8 3v16' /><path d='M2 21h20M8 8h2m4 0h2M8 12h2m4 0h2M8 16h2m4 0h2' /></>,
  chart: <><path d='M4 19V5M4 19h16' /><path d='m7 15 4-4 3 2 5-6' /></>,
  check: <path d='m5 12 4 4L19 6' />,
  'chevron-down': <path d='m6 9 6 6 6-6' />,
  clock: <><circle cx='12' cy='12' r='9' /><path d='M12 7v5l3 2' /></>,
  close: <path d='m6 6 12 12M18 6 6 18' />,
  compass: <><circle cx='12' cy='12' r='9' /><path d='m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z' /></>,
  compare: <><rect x='3' y='5' width='7' height='14' rx='1.5' /><rect x='14' y='5' width='7' height='14' rx='1.5' /></>,
  file: <><path d='M6 2h8l4 4v16H6z' /><path d='M14 2v5h5M9 12h6M9 16h6' /></>,
  filter: <path d='M4 5h16l-6 7v6l-4 2v-8z' />,
  heart: <path d='M20.8 8.6c0 5.7-8.8 11-8.8 11s-8.8-5.3-8.8-11A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z' />,
  help: <><circle cx='12' cy='12' r='9' /><path d='M9.6 9a2.5 2.5 0 1 1 3.2 2.4c-.8.3-.8 1-.8 1.6m0 4h.01' /></>,
  history: <><path d='M3 12a9 9 0 1 0 3-6.7L3 8' /><path d='M3 3v5h5M12 7v5l3 2' /></>,
  home: <><path d='m3 11 9-8 9 8' /><path d='M5 10v11h14V10M9 21v-6h6v6' /></>,
  info: <><circle cx='12' cy='12' r='9' /><path d='M12 11v6m0-10h.01' /></>,
  key: <><circle cx='8' cy='15' r='4' /><path d='m11 12 9-9m-3 3 3 3m-6 0 3 3' /></>,
  map: <><path d='m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3z' /><path d='M8 3v15m8-12v15' /></>,
  menu: <path d='M4 6h16M4 12h16M4 18h16' />,
  message: <><path d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z' /><path d='M8 9h8m-8 4h5' /></>,
  minus: <path d='M5 12h14' />,
  plus: <path d='M12 5v14M5 12h14' />,
  renovation: <><path d='m14 6 4-4 4 4-4 4' /><path d='m16 8-9 9-3 1 1-3 9-9M14 19h7' /></>,
  search: <><circle cx='11' cy='11' r='7' /><path d='m20 20-4-4' /></>,
  settings: <><circle cx='12' cy='12' r='3' /><path d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1A1.7 1.7 0 0 0 4.3 7l-.1-.1L7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z' /></>,
  shield: <><path d='M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5z' /><path d='m8.5 12 2.2 2.2 4.8-5' /></>,
  star: <path d='m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3L2.8 9.5l6.4-.9z' />,
  user: <><circle cx='12' cy='8' r='4' /><path d='M4 21a8 8 0 0 1 16 0' /></>,
  verified: <><circle cx='12' cy='12' r='9' /><path d='m8 12 2.5 2.5L16 9' /></>,
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> { name: IconName; size?: number }

export function Icon({ name, size = 20, ...props }: IconProps) {
  return <svg aria-hidden='true' viewBox='0 0 24 24' width={size} height={size} fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' {...props}>{paths[name]}</svg>
}
