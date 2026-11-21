[English](README.md) | **Nederlands**

# ZekerWie.nl — Authenticatiekaart voor familie & bekenden

Ik heb dit projectje oorspronkelijk gebouwd omdat ik voor mijn eigen familie een simpele, betrouwbare manier zocht om aan de telefoon zeker te weten dat we echt elkaar spreken — geïnspireerd op de authenticatiekaartjes van vroeger uit het leger. Met de opkomst van AI-stemklonen en telefoonfraude leek het me mooi om deze tool ook voor iedereen beschikbaar te maken.

Live gebruiken: **[zekerwie.nl](https://zekerwie.nl)**

---

## Hoe werkt het?

1. **Vul een titel in** (bijvoorbeeld je familienaam) en klik op **Genereer willekeurige getallen**.
2. **Download een PDF** in het gewenste formaat:
   - **4 kaartjes op één A4** — standaard voor een gezin, met snijlijnen exact in het midden (`105 × 148,5 mm`).
   - **1 groot kaartje op A4** — extra grote cijfers en tekst (handig voor bijv. opa of oma).
   - **1 los A6-kaartje** — ansichtkaartformaat (voorkant + achterkant).
3. **Print dubbelzijdig** (spiegelen over de lange zijde, schaal 100%) en knip de kaartjes uit.
4. **Aan de telefoon:** Degene die wil controleren kiest één van de 10 iconen bovenaan. De ander kijkt bij de **dag van vandaag** (`1` t/m `31`) en noemt het getal op het kruispunt. Klopt het getal? Dan weet je zeker wie je aan de lijn hebt.
5. **Extra veilig:** Streep een getal door nadat je het gebruikt hebt, zodat hetzelfde antwoord nooit een tweede keer gebruikt kan worden.

---

## 100% privé & volledig lokaal

- **Geen server, geen database, geen cookies, geen statistieken.**
- Alle getallen worden uitsluitend lokaal in jouw eigen browser gegenereerd via `window.crypto.getRandomValues()` met rejection sampling (zonder dubbele getallen per rij).
- De PDF-bestanden worden volledig lokaal in JavaScript opgebouwd ([pdf.js](pdf.js)), zonder externe libraries of netwerkverzoeken.
- Zodra je het tabblad sluit of ververst, zijn alle getallen definitief verdwenen.

---

## Zelf hosten

Dit is een volledig statische website (HTML, CSS en JavaScript) zonder build-stap:

1. Fork of download deze repository.
2. Open `index.html` direct in je browser, of zet **GitHub Pages** aan op de `main` branch.

---

## Licentie

Dit project valt onder de **MIT-licentie** — zie [LICENSE](LICENSE). Je mag de code vrij gebruiken, aanpassen en delen.
