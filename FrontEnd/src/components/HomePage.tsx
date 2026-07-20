import type { SharedPageProps } from '../data'
import { HomeCommunity } from './HomeCommunity'
import { HomeDiscovery } from './HomeDiscovery'
import { HomeHero } from './HomeHero'
import { PropertyDossier } from './PropertyDossier'

export function HomePage(props: SharedPageProps) {
  return (
    <>
      <HomeHero navigate={props.navigate} />
      <PropertyDossier navigate={props.navigate} />
      <HomeDiscovery {...props} />
      <HomeCommunity navigate={props.navigate} />
    </>
  )
}
