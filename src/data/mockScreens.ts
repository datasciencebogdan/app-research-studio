import { AppTreeNode } from '@/types'

export interface ScreenDef {
  id: string
  label: string
}

export function getMockScreens(appId: string): ScreenDef[] {
  const screens: Record<string, ScreenDef[]> = {
    lidl: [
      { id: 'home', label: 'Strona główna' },
      { id: 'oferty', label: 'Oferty tygodnia' },
      { id: 'produkty', label: 'Produkty' },
      { id: 'konto', label: 'Lidl Plus' },
    ],
    kaufland: [
      { id: 'home', label: 'Strona główna' },
      { id: 'gazetka', label: 'Gazetka' },
      { id: 'oferty', label: 'Oferty specjalne' },
      { id: 'konto', label: 'Mój Kaufland' },
    ],
    biedronka: [
      { id: 'home', label: 'Strona główna' },
      { id: 'oferty', label: 'Oferty' },
      { id: 'ulubione', label: 'Ulubione' },
      { id: 'konto', label: 'Moja Biedronka' },
    ],
    decathlon: [
      { id: 'home', label: 'Strona główna' },
      { id: 'kategorie', label: 'Kategorie' },
      { id: 'produkt', label: 'Karta produktu' },
      { id: 'koszyk', label: 'Koszyk' },
    ],
    carrefour: [
      { id: 'home', label: 'Strona główna' },
      { id: 'program', label: 'Program Carrefour' },
      { id: 'oferty', label: 'Oferty' },
      { id: 'koszyk', label: 'Koszyk' },
    ],
  }
  return screens[appId] ?? [{ id: 'home', label: 'Strona główna' }]
}

export function getMockAppTree(appId: string): AppTreeNode[] {
  const trees: Record<string, AppTreeNode[]> = {
    lidl: [
      {
        id: 'home',
        label: 'Strona główna',
        children: [
          { id: 'oferty-tyg', label: 'Oferty tygodnia' },
          {
            id: 'produkty',
            label: 'Produkty',
            children: [
              { id: 'swieze', label: 'Świeże' },
              { id: 'mieso', label: 'Mięso' },
              { id: 'nabia', label: 'Nabiał' },
              { id: 'piekarnia', label: 'Piekarnia' },
            ],
          },
          { id: 'gazetka', label: 'Gazetka' },
          {
            id: 'lidl-plus',
            label: 'Lidl Plus',
            children: [
              { id: 'kupony', label: 'Moje kupony' },
              { id: 'punkty', label: 'Punkty' },
            ],
          },
          { id: 'ustawienia', label: 'Ustawienia' },
        ],
      },
    ],
    kaufland: [
      {
        id: 'home',
        label: 'Strona główna',
        children: [
          { id: 'gazetka', label: 'Gazetka' },
          { id: 'oferty', label: 'Oferty specjalne' },
          {
            id: 'konto',
            label: 'Mój Kaufland',
            children: [
              { id: 'karta', label: 'Karta' },
              { id: 'historia', label: 'Historia zakupów' },
            ],
          },
          { id: 'sklepy', label: 'Sklepy' },
          { id: 'ustawienia', label: 'Ustawienia' },
        ],
      },
    ],
    biedronka: [
      {
        id: 'home',
        label: 'Strona główna',
        children: [
          {
            id: 'oferty',
            label: 'Oferty',
            children: [
              { id: 'promocje', label: 'Promocje' },
              { id: 'gazetka', label: 'Gazetka' },
            ],
          },
          { id: 'ulubione', label: 'Ulubione' },
          {
            id: 'moja-biedronka',
            label: 'Moja Biedronka',
            children: [
              { id: 'punkty', label: 'Punkty' },
              { id: 'kupony', label: 'Kupony' },
            ],
          },
          { id: 'sklepy', label: 'Sklepy' },
        ],
      },
    ],
    decathlon: [
      {
        id: 'home',
        label: 'Strona główna',
        children: [
          {
            id: 'kategorie',
            label: 'Kategorie',
            children: [
              { id: 'fitness', label: 'Fitness' },
              { id: 'rower', label: 'Rower' },
              { id: 'running', label: 'Running' },
              { id: 'pilka', label: 'Piłka nożna' },
              { id: 'plywanie', label: 'Pływanie' },
            ],
          },
          { id: 'produkty', label: 'Produkty' },
          { id: 'koszyk', label: 'Koszyk' },
          { id: 'konto', label: 'Konto' },
        ],
      },
    ],
    carrefour: [
      {
        id: 'home',
        label: 'Strona główna',
        children: [
          {
            id: 'program',
            label: 'Program Carrefour',
            children: [
              { id: 'punkty', label: 'Punkty' },
              { id: 'nagrody', label: 'Nagrody' },
            ],
          },
          { id: 'oferty', label: 'Oferty' },
          { id: 'koszyk', label: 'Koszyk' },
          { id: 'zamowienia', label: 'Moje zamówienia' },
          { id: 'konto', label: 'Konto' },
        ],
      },
    ],
  }
  return trees[appId] ?? [{ id: 'home', label: 'Strona główna' }]
}
