**English** | [Nederlands](README.nl.md)

# ZekerWie.nl — Printable Family Authentication Cards

I originally built this small project because I wanted a simple, reliable way for my own family to verify that we are really talking to each other on the phone — inspired by classic military challenge-response authentication cards. With the rise of AI voice cloning and impersonation phone scams, I decided to make it open-source and available to everyone.

Try it live: **[zekerwie.nl](https://zekerwie.nl)**

---

## How It Works

1. **Enter a title** (for example, your family name) and click **Genereer willekeurige getallen** (Generate random numbers).
2. **Download a print-ready PDF** in your preferred format:
   - **4 cards on one A4 sheet** — standard family set with centered cut lines (`105 × 148.5 mm` each).
   - **1 large card on A4** — extra-large numbers and text (great for grandparents or low-vision readers).
   - **1 single A6 card** — postcard size (front + back).
3. **Print double-sided** (flip on long edge, 100% scale) and cut along the dashed center lines.
4. **On a call:** The person who wants to verify the caller picks one of the 10 recognizable icons at the top. The other person looks up **today's day of the month** (`1`–`31`) and reads the 2-digit number at that intersection.
5. **Extra security:** Cross off each number after using it so the same code can never be reused.

---

## 100% Private & Client-Side

- **No servers, no databases, no cookies, no analytics.**
- All numbers are generated locally in your browser using `window.crypto.getRandomValues()` with rejection sampling and a Fisher-Yates shuffle (guaranteed no duplicate numbers per row).
- PDFs are built directly in pure JavaScript ([pdf.js](pdf.js)) with zero external libraries or network requests.
- Once you close or refresh the tab, the generated codes are gone forever.

---

## Self-Hosting

This is a 100% static HTML, CSS, and vanilla JavaScript site with no build step:

1. Fork or download this repository.
2. Open `index.html` locally in any browser, or enable **GitHub Pages** on the `main` branch.

---

## License

Licensed under the **MIT License** — see [LICENSE](LICENSE). Feel free to use, adapt, and share.
