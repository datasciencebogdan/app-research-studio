# App Research Studio

Środowisko badawcze do testowania i analizy aplikacji mobilnych na Androida. Umożliwia uruchamianie prawdziwych emulatorów, instalowanie APK, robienie zrzutów ekranu, porównywanie aplikacji i zarządzanie sesjami badawczymi.

---

## Spis treści

- [Przegląd](#przegląd)
- [Stos technologiczny](#stos-technologiczny)
- [Architektura](#architektura)
- [Struktura plików](#struktura-plików)
- [Uruchomienie](#uruchomienie)
- [Funkcje](#funkcje)
- [API Routes (ADB)](#api-routes-adb)
- [Integracja z emulatorem](#integracja-z-emulatorem)
- [GCP Infrastructure](#gcp-infrastructure)
- [Roadmap](#roadmap)

---

## Przegląd

App Research Studio to narzędzie dla UX researcherów i analityków produktowych, które pozwala na:

- **Podgląd na żywo** ekranów prawdziwych emulatorów Androida bezpośrednio w przeglądarce
- **Instalację APK** przez interfejs webowy
- **Porównywanie aplikacji** side-by-side (nieograniczona liczba jednocześnie)
- **Zrzuty ekranu** i organizowanie ich w sekcje badawcze
- **Nagrywanie sesji** z adnotacjami
- **Drzewa komponentów** aplikacji
- **Eksport** całej sesji do JSON

---

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | Next.js 16.2 (App Router, React 19) |
| Style | Tailwind CSS v4 (CSS-only config) |
| Stan | Zustand v5 + persist middleware |
| Screenshoty | html-to-image (toPng) |
| Ikony | lucide-react |
| Emulator (lokalnie) | Android Studio AVD / BlueStacks + ADB |
| Emulator (GCP) | budtmo/docker-android + noVNC |
| Infrastruktura | Terraform + GCP Compute Engine |

---

## Architektura

```
┌─────────────────────────────────────────────────────┐
│                  Przeglądarka                        │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │ TopBar   │  │  Workspace    │  │ RightSidebar │  │
│  └──────────┘  │ (EmulatorWin)│  │ (AppList +   │  │
│                │              │  │  EmulatorPanel│  │
│  ┌─────────────────────────┐  │  └──────────────┘  │
│  │    BottomDrawer         │  │                     │
│  │ (Log/Sekcje/Nagrania/   │  │                     │
│  │  Drzewo)                │  │                     │
│  └─────────────────────────┘  │                     │
└───────────────────────────────┼─────────────────────┘
                                │ fetch /api/emulator/*
┌───────────────────────────────▼─────────────────────┐
│              Next.js API Routes (Node.js)            │
│  /status  /screenshot  /tap  /swipe  /key  /install  │
└───────────────────────────────┬─────────────────────┘
                                │ child_process / ADB
┌───────────────────────────────▼─────────────────────┐
│           Android Emulator (lokalnie / GCP)          │
│         emulator-5554 / 127.0.0.1:5555               │
└─────────────────────────────────────────────────────┘
```

**Tryb mock** — gdy nie ma podłączonego emulatora, aplikacja pokazuje predefiniowane polskie UI dla 5 aplikacji sklepowych (Lidl, Kaufland, Biedronka, Decathlon, Carrefour) z nawigowalnymi ekranami.

**Tryb rzeczywisty** — gdy ADB wykryje emulator, panel boczny pokazuje przycisk `▷ Uruchom`. Po kliknięciu `EmulatorWindow` przełącza się w tryb live: polling screenshotów co 600ms, kliknięcia mapowane na współrzędne ADB.

---

## Struktura plików

```
app-research-studio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Server Component)
│   │   ├── page.tsx                # Strona główna
│   │   ├── globals.css             # Tailwind v4 + dark mode variant
│   │   └── api/emulator/
│   │       ├── lib/adb.ts          # ADB helper (getAdbPath, adbShell, adbScreencap, adbInstall)
│   │       ├── status/route.ts     # GET  — status ADB i lista emulatorów
│   │       ├── screenshot/route.ts # GET  — screencap jako PNG
│   │       ├── tap/route.ts        # POST — input tap x y
│   │       ├── swipe/route.ts      # POST — input swipe x1 y1 x2 y2
│   │       ├── key/route.ts        # POST — input keyevent <keycode>
│   │       └── install/route.ts    # POST — adb install -r <apk>
│   ├── components/
│   │   ├── ThemeWrapper.tsx        # Client wrapper: toggleuje klasę 'dark' na <html>
│   │   ├── apps/
│   │   │   ├── AppItem.tsx         # Jedna pozycja listy aplikacji (toggle mock mode)
│   │   │   ├── AppList.tsx         # Lista wszystkich aplikacji
│   │   │   ├── AddAppModal.tsx     # Modal dodawania nowej aplikacji
│   │   │   └── EmulatorPanel.tsx   # Panel ADB: status + przyciski Uruchom real
│   │   ├── layout/
│   │   │   ├── TopBar.tsx          # Górny pasek (logo, nagrywanie, dark mode, eksport)
│   │   │   └── RightSidebar.tsx    # Prawy panel (EmulatorPanel + AppList)
│   │   ├── panels/
│   │   │   ├── BottomDrawer.tsx    # Dolna szuflada z zakładkami
│   │   │   ├── ActivityLog.tsx     # Log aktywności sesji
│   │   │   ├── SectionsPanel.tsx   # Zarządzanie sekcjami badawczymi
│   │   │   ├── RecordingsPanel.tsx # Lista nagrań
│   │   │   └── AppTreePanel.tsx    # Drzewo komponentów aplikacji
│   │   └── workspace/
│   │       ├── Workspace.tsx       # Canvas z oknami emulatorów (flex/scroll)
│   │       ├── EmulatorWindow.tsx  # Okno telefonu (mock + real mode)
│   │       ├── MockScreenContent.tsx # Polskie UI dla 5 aplikacji sklepowych
│   │       └── RealEmulatorScreen.tsx # Live polling ADB screenshot + tap/scroll
│   ├── store/
│   │   └── sessionStore.ts         # Zustand v5 store (persist → localStorage)
│   ├── data/
│   │   ├── mockApps.ts             # 5 aplikacji sklepowych z kolorami marki
│   │   └── mockScreens.ts          # Definicje ekranów i drzew komponentów
│   ├── types/
│   │   └── index.ts                # Typy: App, RunningApp, Screenshot, Section, Recording
│   └── hooks/
│       └── useEmulatorRef.ts       # Hook dla referencji okna emulatora
├── infra/
│   ├── terraform/
│   │   ├── main.tf                 # GCP Compute Engine z KVM (nested virtualization)
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── sa-key.json             # ⚠️ GITIGNORE — klucz service account
│   └── scripts/
│       └── startup.sh              # Docker: budtmo/docker-android:emulator_11.0
└── next.config.ts
```

---

## Uruchomienie

### Wymagania

- Node.js 20+
- Android Studio (z AVD Manager) **lub** BlueStacks z włączonym ADB
- Android SDK Platform Tools (`adb.exe`)

### Instalacja

```bash
git clone https://github.com/datasciencebogdan/geo-insights-planner.git
cd geo-insights-planner
npm install
```

### Uruchomienie lokalne

```powershell
# Windows PowerShell — ustaw ANDROID_HOME przed startem
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npm run dev
```

Aplikacja dostępna na `http://localhost:3000`.

### Uruchomienie z prawdziwym emulatorem

1. Uruchom emulator w Android Studio (AVD Manager → ▶) lub BlueStacks
2. Włącz ADB w BlueStacks: `Settings → Advanced → Enable Android Debug Bridge`
3. Zweryfikuj połączenie: `adb devices` — powinna być widoczna pozycja `emulator-5554` lub `127.0.0.1:5555`
4. Otwórz `http://localhost:3000` — panel "Emulator" wykryje urządzenie automatycznie

### Instalacja APK

**Przez UI App Research Studio:**
1. Kliknij `▷ Uruchom` w panelu Emulator
2. W oknie telefonu kliknij ikonę Upload (↑)
3. Wybierz plik `.apk`

**Przez ADB:**
```bash
adb install -r aplikacja.apk
```

**Pobieranie APK bez konta Google:**
- [APKPure](https://apkpure.net) — pobierz `.apk` bezpośrednio w przeglądarce

---

## Funkcje

### Workspace
- Nieograniczona liczba okien emulatorów side-by-side
- Tryb mock (predefiniowane polskie UI) i tryb rzeczywisty (live ADB)
- Nawigacja między ekranami w trybie mock
- Przyciski Android: Wstecz / Home / Ostatnie aplikacje
- Scroll przez kółko myszy → swipe na emulatorze

### Zrzuty ekranu
- Przycisk kamery w każdym oknie
- Organizowanie w sekcje badawcze
- Eksport całej sesji jako JSON

### Nagrywanie sesji
- Start/Stop w TopBar
- Historia nagrań w BottomDrawer

### Zarządzanie aplikacjami
- 5 preinstalowanych aplikacji: Lidl, Kaufland, Biedronka, Decathlon, Carrefour
- Dodawanie własnych aplikacji przez modal (+)
- Status: dostępna / uruchomiona / zatrzymana

---

## API Routes (ADB)

Wszystkie endpointy działają przez Next.js API Routes. ADB wykrywane automatycznie z `ANDROID_HOME`.

### `GET /api/emulator/status`

```json
{
  "adbFound": true,
  "adbVersion": "Android Debug Bridge version 1.0.41",
  "emulators": ["emulator-5554"],
  "message": "1 emulator(s) connected"
}
```

### `GET /api/emulator/screenshot?serial=emulator-5554`
Zwraca screencap jako `image/png`. `Cache-Control: no-cache`.

### `POST /api/emulator/tap`
```json
{ "serial": "emulator-5554", "x": 540, "y": 960 }
```
Współrzędne w przestrzeni 1080×1920 px.

### `POST /api/emulator/swipe`
```json
{ "serial": "emulator-5554", "x1": 540, "y1": 1400, "x2": 540, "y2": 600, "duration": 300 }
```

### `POST /api/emulator/key`
```json
{ "serial": "emulator-5554", "keycode": 4 }
```
Keycody: `3` = Home, `4` = Back, `187` = Recents.

### `POST /api/emulator/install`
Multipart form z polem `apk`. Opcjonalnie `?serial=emulator-5554`.

---

## Integracja z emulatorem

### Wykrywanie ADB

ADB szukane w kolejności:
1. `ADB_PATH` (zmienna środowiskowa)
2. `ANDROID_HOME/platform-tools/adb.exe`
3. `ANDROID_SDK_ROOT/platform-tools/adb.exe`
4. `%LOCALAPPDATA%/Android/Sdk/platform-tools/adb.exe`
5. `adb` w PATH systemu

### Emulator na GCP

Terraform (`infra/terraform/`) tworzy VM z KVM i uruchamia `budtmo/docker-android:emulator_11.0` z noVNC na porcie 6080.

```bash
cd infra/terraform
terraform init
terraform apply
# Po starcie VM:
adb connect <VM_EXTERNAL_IP>:5555
```

Komentarze `// GCP_INTEGRATION` w kodzie oznaczają miejsca gotowe do podmiany na WebRTC stream.

> ⚠️ `infra/terraform/sa-key.json` jest w `.gitignore` i nigdy nie może trafić do repozytorium.

---

## Roadmap

- [ ] APK Manager — przeglądarka zainstalowanych aplikacji
- [ ] Automatyczny screenshot polling — konfigurowalny interwał
- [ ] Eksport PDF — raport z sekcji badawczych
- [ ] **AI UX Agent** — automatyczna analiza interfejsów (Claude Vision)
- [ ] GCP Cloud Emulator — WebRTC stream zamiast pollingu
- [ ] Multi-user sessions — współdzielenie sesji przez link
- [ ] App Tree Generator — automatyczne drzewo UI przez accessibility API

---

## Licencja

Projekt wewnętrzny — do użytku badawczego.
