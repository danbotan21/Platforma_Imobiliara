import aptCentru from './assets/apt-centru.jpg'
import aptRiscani from './assets/apt-riscani.jpg'
import aptBotanica from './assets/apt-botanica.jpg'
import aptBuiucani from './assets/apt-buiucani.jpg'
import aptCiocana from './assets/apt-ciocana.jpg'
import building from './assets/building.jpg'
import bedroom from './assets/bedroom.jpg'
import kitchen from './assets/kitchen.jpg'
import before from './assets/before.jpg'
import after from './assets/after.jpg'

export type Navigate = (path: string) => void
export type ListingMode = 'rent' | 'sale'
export type ListingStatus = 'available' | 'unavailable'

export interface Property {
  id: string
  slug: string
  mode: ListingMode
  status: ListingStatus
  address: string
  district: string
  complex: string
  price: number
  previousPrice: number
  pricePerSqm: number
  trend: number
  trendLabel: string
  rooms: number
  area: number
  floor: string
  year: number
  rating: number
  reviews: number
  image: string
  verified: boolean
  special?: 'reduced' | 'new'
  mapX: number
  mapY: number
  features: string[]
}

export interface SharedPageProps {
  navigate: Navigate
  favorites: string[]
  compare: string[]
  toggleFavorite: (id: string) => void
  toggleCompare: (id: string) => void
  notify: (message: string) => void
}

export const properties: Property[] = [
  {
    id: 'LOC-2481', slug: 'lev-tolstoi-24', mode: 'rent', status: 'available',
    address: 'str. Lev Tolstoi 24/1', district: 'Centru', complex: 'Toro Center',
    price: 650, previousPrice: 615, pricePerSqm: 10.15, trend: 5.8,
    trendLabel: 'în ultimele 12 luni', rooms: 2, area: 64, floor: '7 din 12', year: 2019,
    rating: 9.2, reviews: 46, image: aptCentru, verified: true, special: 'new', mapX: 49, mapY: 42,
    features: ['Mobilat', 'Parcare', 'Ascensor', 'Încălzire autonomă'],
  },
  {
    id: 'LOC-1934', slug: 'moscova-18', mode: 'sale', status: 'available',
    address: 'bd. Moscova 18/2', district: 'Râșcani', complex: 'Oasis Residence',
    price: 118500, previousPrice: 122400, pricePerSqm: 1445, trend: -3.2,
    trendLabel: 'față de ultima listare', rooms: 3, area: 82, floor: '4 din 9', year: 2020,
    rating: 8.8, reviews: 31, image: aptRiscani, verified: true, special: 'reduced', mapX: 70, mapY: 29,
    features: ['Curte închisă', 'Parcare subterană', 'Ascensor', 'Pază'],
  },
  {
    id: 'LOC-3108', slug: 'grenoble-128', mode: 'rent', status: 'available',
    address: 'str. Grenoble 128', district: 'Botanica', complex: 'Eldorado Terra',
    price: 520, previousPrice: 509, pricePerSqm: 8.96, trend: 2.1,
    trendLabel: 'în ultimele 12 luni', rooms: 2, area: 58, floor: '3 din 10', year: 2017,
    rating: 9.0, reviews: 27, image: aptBotanica, verified: true, mapX: 58, mapY: 72,
    features: ['Mobilat', 'Animale acceptate', 'Ascensor', 'Balcon'],
  },
  {
    id: 'LOC-4210', slug: 'alba-iulia-77', mode: 'sale', status: 'available',
    address: 'str. Alba Iulia 77/4', district: 'Buiucani', complex: 'Exfactor Liviu Deleanu',
    price: 96500, previousPrice: 91400, pricePerSqm: 1359, trend: 5.6,
    trendLabel: 'în ultimele 12 luni', rooms: 2, area: 71, floor: '6 din 14', year: 2022,
    rating: 8.6, reviews: 18, image: aptBuiucani, verified: true, special: 'new', mapX: 25, mapY: 39,
    features: ['Variantă albă', 'Parcare', '2 ascensoare', 'Terasă'],
  },
  {
    id: 'LOC-3877', slug: 'decebal-6', mode: 'rent', status: 'unavailable',
    address: 'bd. Decebal 6/3', district: 'Botanica', complex: 'Decebal Avenue',
    price: 780, previousPrice: 730, pricePerSqm: 8.57, trend: 6.8,
    trendLabel: 'la ultima perioadă activă', rooms: 3, area: 91, floor: '10 din 13', year: 2021,
    rating: 9.4, reviews: 39, image: aptCiocana, verified: true, mapX: 61, mapY: 64,
    features: ['Închiriat', 'Panoramă', 'Parcare', 'Climatizare'],
  },
  {
    id: 'LOC-5529', slug: 'studentilor-9', mode: 'sale', status: 'available',
    address: 'str. Studenților 9/11', district: 'Râșcani', complex: 'Urban Construct',
    price: 142000, previousPrice: 137800, pricePerSqm: 1379, trend: 3.0,
    trendLabel: 'în ultimele 12 luni', rooms: 3, area: 103, floor: '8 din 15', year: 2023,
    rating: 9.1, reviews: 22, image: building, verified: false, mapX: 76, mapY: 22,
    features: ['Construcție nouă', 'Parcare', 'Ascensor', 'Curte'],
  },
]

export const galleryImages = [
  { src: aptCentru, alt: 'Living luminos cu bucătărie deschisă' },
  { src: bedroom, alt: 'Dormitor cu finisaje neutre' },
  { src: kitchen, alt: 'Bucătărie complet utilată' },
  { src: building, alt: 'Fațada blocului rezidențial' },
]

export const renovationImages = { before, after }

export const recentReviews = [
  { id: 'REC-101', initials: 'NM', name: 'Nicoleta M.', role: 'Fost chiriaș verificat', property: 'str. Lev Tolstoi 24/1', period: 'martie 2023 – iunie 2025', rating: 4.7, text: 'Apartamentul a corespuns fotografiilor. Proprietarul a reparat centrala în două zile, iar costurile au rămas apropiate de estimare.', pros: 'Liniște, lumină naturală, proprietar receptiv', cons: 'Parcarea se ocupă repede seara', helpful: 42 },
  { id: 'REC-102', initials: 'AP', name: 'Andrei P.', role: 'Cumpărător verificat', property: 'bd. Moscova 18/2', period: 'cumpărat în 2025', rating: 4.4, text: 'Istoricul listărilor mi-a oferit un reper bun pentru negociere. Blocul este îngrijit și transportul este foarte comod.', pros: 'Bloc curat, curte sigură, transport bun', cons: 'Izolație fonică medie', helpful: 31 },
  { id: 'REC-103', initials: 'IC', name: 'Irina C.', role: 'Chiriaș verificat', property: 'str. Grenoble 128', period: 'august 2024 – prezent', rating: 4.5, text: 'Datele despre utilități au fost realiste. Administratorul răspunde rapid, iar zona este bună pentru o familie.', pros: 'Curte, magazine aproape, căldură bună', cons: 'Trafic la orele de vârf', helpful: 26 },
]

export const historyEvents = [
  { date: 'Iulie 2026', event: 'Listare pentru chirie', price: '€650/lună', change: '+5,8%', source: 'Proprietar', trust: 'Confirmat de proprietar' },
  { date: 'August 2024', event: 'Renovare completă', price: '€18.400', change: '—', source: 'Facturi și fotografii', trust: 'Verificat prin document' },
  { date: 'August 2022', event: 'Contract de chirie', price: '€480/lună', change: '+6,7%', source: 'Contract anonimizat', trust: 'Verificat prin document' },
  { date: 'Noiembrie 2019', event: 'Tranzacție', price: '€71.000', change: '—', source: 'Extras cadastral', trust: 'Verificat prin document' },
]

export const ownerHistory = [
  { period: '2019–2024', title: 'Proprietar anterior verificat', person: 'Identitate protejată', details: '1 anunț asociat · transfer confirmat prin act', rating: '4,6/5' },
  { period: '2024–prezent', title: 'Proprietar actual verificat', person: 'Victor I.', details: '2 anunțuri asociate · răspunde în aproximativ 2 ore', rating: '4,8/5' },
  { period: '2024–prezent', title: 'Administrator verificat', person: 'Urban Management SRL', details: 'Administrare bloc și spații comune', rating: '4,3/5' },
]

export const occupancyHistory = [
  { period: 'aug. 2022 – iun. 2024', rent: '€480 → €520/lună', duration: '23 luni', status: 'Contract încheiat', reason: 'Relocare profesională', review: '4,7/5' },
  { period: 'oct. 2020 – mai 2022', rent: '€450/lună', duration: '20 luni', status: 'Confirmat de chiriaș', reason: 'Nespecificat', review: '4,4/5' },
]

export function money(value: number): string {
  return `€${value.toLocaleString('ro-RO')}`
}

export function propertyBySlug(slug: string): Property {
  return properties.find((property) => property.slug === slug) ?? properties[0]
}
