import { App } from '@/types'

export const mockApps: App[] = [
  {
    id: 'lidl',
    name: 'Lidl',
    packageName: 'de.sec.mobile.lidl',
    brandColor: '#E3000B',
    icon: '🛒',
    status: 'available',
  },
  {
    id: 'kaufland',
    name: 'Kaufland',
    packageName: 'de.kaufland.android',
    brandColor: '#E30613',
    icon: '🏪',
    status: 'available',
  },
  {
    id: 'biedronka',
    name: 'Biedronka',
    packageName: 'com.jmm.biedronka',
    brandColor: '#E2001A',
    icon: '🐞',
    status: 'available',
  },
  {
    id: 'decathlon',
    name: 'Decathlon',
    packageName: 'com.decathlon.android',
    brandColor: '#007DBA',
    icon: '🏃',
    status: 'available',
  },
  {
    id: 'carrefour',
    name: 'Carrefour',
    packageName: 'com.carrefour.pl',
    brandColor: '#004A96',
    icon: '🛍️',
    status: 'available',
  },
]
