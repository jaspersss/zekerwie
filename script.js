(() => {
  const DAYS = 31;

  const ICONS = [
    {
      name: "Auto",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5H2.5v-4l3-1 2.5-4.5h7l3 4.5 3.5 1v4h-2"/><path d="M9 16.5h6"/><circle cx="6.8" cy="16.5" r="2.2"/><circle cx="17.2" cy="16.5" r="2.2"/><path d="M6 11.5h11.5"/><path d="M11.5 7v4.5"/></svg>`
    },
    {
      name: "Appel",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-3-2-7 0-7 5 0 5 3 10 5.5 10 1 0 1.5-.5 1.5-.5s.5.5 1.5.5C16 21 19 16 19 11c0-5-4-7-7-5Z"/><path d="M12 6c0-2 1.5-3.5 3.5-4"/></svg>`
    },
    {
      name: "Huis",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/></svg>`
    },
    {
      name: "Sleutel",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="12" r="4"/><path d="M11.5 12H21"/><path d="M17 12v3.5"/><path d="M20 12v2.5"/></svg>`
    },
    {
      name: "Zon",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>`
    },
    {
      name: "Hart",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.7-9.2-9.2C1.6 8 3.6 4.5 7.2 4.5c2 0 3.7 1.1 4.8 2.7 1.1-1.6 2.8-2.7 4.8-2.7 3.6 0 5.6 3.5 4.4 6.8-1.7 4.5-9.2 9.2-9.2 9.2Z"/></svg>`
    },
    {
      name: "Ster",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 15.1 8.6 22 9.3 16.8 14 18.2 21 12 17.3 5.8 21 7.2 14 2 9.3 8.9 8.6 12 2"/></svg>`
    },
    {
      name: "Boek",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c3.5-2 7-1 10 1.5C15 5 18.5 4 22 6v13c-3.5-2-7-1-10 1.5C9 18 5.5 17 2 19V6Z"/><path d="M12 7.5v13"/><path d="M5 10.5l4 .8M5 14l4 .8M19 10.5l-4 .8M19 14l-4 .8"/></svg>`
    },
    {
      name: "Vliegtuig",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"/></svg>`
    },
    {
      name: "Boom",
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M12 3 5 12h4l-3 5h12l-3-5h4L12 3Z"/></svg>`
    }
  ];

  const workspace = document.querySelector(".workspace");
  const rightPanel = document.getElementById("rightPanel");
  const mobilePreviewBtn = document.getElementById("mobilePreviewBtn");
  const mobilePreviewDrawer = document.getElementById("mobilePreviewDrawer");
  const mobilePreviewSlot = document.getElementById("mobilePreviewSlot");
  const cardStage = document.getElementById("cardStage");
  const tabFront = document.getElementById("tabFront");
  const tabBack = document.getElementById("tabBack");
  const titleInput = document.getElementById("cardTitleInput");
  const randomizeBtn = document.getElementById("randomizeBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const downloadMenu = document.getElementById("downloadMenu");
  const statusNote = document.getElementById("statusNote");

  let gridData = null;
  let activeSide = "front";
  let mobilePreviewOpen = false;
  let downloadMenuOpen = false;
  const mobileQuery = window.matchMedia("(max-width: 640px)");

  function randomInt(max) {
    const array = new Uint32Array(1);
    const limit = Math.floor(0xffffffff / max) * max;
    let value;
    do {
      window.crypto.getRandomValues(array);
      value = array[0];
    } while (value >= limit);
    return value % max;
  }

  function generateTableData() {
    const rows = [];
    for (let day = 0; day < DAYS; day++) {
      const pool = Array.from({ length: 100 }, (_, i) => i);
      for (let i = 0; i < ICONS.length; i++) {
        const j = i + randomInt(pool.length - i);
        const temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
      }
      rows.push(pool.slice(0, ICONS.length).map((n) => String(n).padStart(2, "0")));
    }
    gridData = rows;
  }

  function createEmptyTableData() {
    return Array.from({ length: DAYS }, () => Array(ICONS.length).fill("··"));
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  const MONTHS_NL = ["JAN", "FEB", "MRT", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];

  function formatCardDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = MONTHS_NL[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function buildFrontCardHtml(title) {
    const safeTitle = escapeHtml(title.trim() || "ZekerWie.nl");
    const rowsToRender = gridData || createEmptyTableData();
    const dateLabel = formatCardDate();

    const headerCells = ICONS.map(
      (icon) => `<th title="${icon.name}" aria-label="${icon.name}"><div class="icon-wrap">${icon.svg}</div></th>`
    ).join("");

    const bodyRows = rowsToRender
      .map((rowValues, index) => {
        const dayNum = index + 1;
        const rowClass = dayNum % 5 === 0 && dayNum < DAYS ? ' class="group-end"' : "";
        const cells = rowValues.map((val) => `<td>${val}</td>`).join("");
        return `<tr${rowClass}><td class="day-cell">${dayNum}</td>${cells}</tr>`;
      })
      .join("");

    return `
      <article class="card front-card">
        <header class="card-header">
          <h2 class="card-title">${safeTitle}</h2>
          <span class="card-date">${dateLabel}</span>
        </header>
        <table class="auth-table">
          <thead>
            <tr>
              <th class="day-col">Dag</th>
              ${headerCells}
            </tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </article>
    `;
  }

  function buildBackCardHtml(title) {
    const safeTitle = escapeHtml(title.trim() || "ZekerWie.nl");
    return `
      <article class="card back-card">
        <div>
          <header class="back-header">
            <h2>Hoe controleer je elkaar?</h2>
            <p class="back-card-name">${safeTitle}</p>
          </header>

          <ol class="steps">
            <li class="step">
              <span class="step-num">1</span>
              <span><strong>Kies een icoon:</strong> Beller kiest een icoon bovenaan de kaart (bijv. <em>"De auto"</em>).</span>
            </li>
            <li class="step">
              <span class="step-num">2</span>
              <span><strong>Noem het getal:</strong> De ander kijkt bij de dag van vandaag en noemt het getal.</span>
            </li>
            <li class="step">
              <span class="step-num">3</span>
              <span><strong>Controleer:</strong> Klopt het getal? Dan weet je zeker wie je aan de lijn hebt.</span>
            </li>
          </ol>

          <div class="example-box">
            <p class="example-title">Voorbeeld: het is vandaag dag 14</p>
            <svg class="example-diagram" viewBox="0 0 260 64" xmlns="http://www.w3.org/2000/svg" aria-label="Visueel voorbeeld van kruispunt dag 14 en icoon Auto">
              <rect x="1" y="1" width="258" height="62" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
              <rect x="8" y="7" width="38" height="19" fill="#e2e8f0" stroke="#94a3b8"/>
              <text x="27" y="19.5" font-size="8" font-weight="700" text-anchor="middle" fill="#0f172a">Dag</text>
              <rect x="46" y="7" width="46" height="19" fill="#e2e8f0" stroke="#94a3b8"/>
              <g transform="translate(61, 8.5) scale(0.67)" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.5 16.5H2.5v-4l3-1 2.5-4.5h7l3 4.5 3.5 1v4h-2"/>
                <path d="M9 16.5h6"/>
                <circle cx="6.8" cy="16.5" r="2.2"/>
                <circle cx="17.2" cy="16.5" r="2.2"/>
                <path d="M6 11.5h11.5"/>
                <path d="M11.5 7v4.5"/>
              </g>
              <rect x="92" y="7" width="46" height="19" fill="#e2e8f0" stroke="#94a3b8"/>
              <g transform="translate(107, 8.5) scale(0.67)" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 6c-3-2-7 0-7 5 0 5 3 10 5.5 10 1 0 1.5-.5 1.5-.5s.5.5 1.5.5C16 21 19 16 19 11c0-5-4-7-7-5Z"/>
                <path d="M12 6c0-2 1.5-3.5 3.5-4"/>
              </g>
              <rect x="8" y="26" width="38" height="20" fill="#f8fafc" stroke="#94a3b8"/>
              <text x="27" y="39" font-size="9" font-weight="700" text-anchor="middle" fill="#0f172a">14</text>
              <rect x="46" y="26" width="46" height="20" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.4"/>
              <text x="69" y="39" font-size="10" font-weight="700" font-family="monospace" text-anchor="middle" fill="#0f172a">42</text>
              <rect x="92" y="26" width="46" height="20" fill="#ffffff" stroke="#94a3b8"/>
              <text x="115" y="39" font-size="9" font-family="monospace" text-anchor="middle" fill="#64748b">87</text>
              <text x="148" y="19" font-size="8" font-weight="700" fill="#0f172a">"Geef me de auto"</text>
              <text x="148" y="33" font-size="8" fill="#0f172a">Antwoord: 42</text>
              <text x="148" y="48" font-size="7" fill="#475569">Kruispunt dag 14 + Auto</text>
            </svg>
          </div>

          <div class="tips-stack">
            <div class="tip-box">
              <strong>Andere datum of brief:</strong> Spreek een andere dag af (<em>"Appel van dag 3"</em>) of gebruik de datum op een brief/bericht.
            </div>
            <div class="tip-box">
              <strong>Extra veilig (eenmalig gebruik):</strong> Streep een getal door nadat je het gebruikt hebt, zodat niemand het nog eens kan gebruiken.
            </div>
          </div>

          <div class="notes-box">
            <p class="notes-title">Notities</p>
            <div class="note-line"></div>
            <div class="note-line"></div>
            <div class="note-line"></div>
            <div class="note-line"></div>
            <div class="note-line"></div>
            <div class="note-line"></div>
          </div>
        </div>

        <footer class="back-footer">
          Bewaar dit kaartje veilig en maak er geen foto's van. Bij verlies: print een nieuwe set.
          <span class="site-credit">Maak je eigen kaartje op zekerwie.nl · MIT-licentie</span>
        </footer>
      </article>
    `;
  }

  function updateUiState() {
    const hasNumbers = Boolean(gridData);
    cardStage.classList.toggle("is-empty", !hasNumbers);
    downloadPdfBtn.disabled = !hasNumbers;

    if (hasNumbers) {
      randomizeBtn.textContent = "Nieuwe getallen";
      randomizeBtn.classList.remove("btn-primary");
      randomizeBtn.classList.add("btn-secondary");
      downloadPdfBtn.classList.remove("btn-secondary");
      downloadPdfBtn.classList.add("btn-primary");
      statusNote.innerHTML =
        "Unieke getallen zijn lokaal gegenereerd. Klik op <strong>Download PDF</strong> en kies het gewenste formaat.";
    } else {
      randomizeBtn.textContent = "Genereer willekeurige getallen";
      randomizeBtn.classList.add("btn-primary");
      randomizeBtn.classList.remove("btn-secondary");
      downloadPdfBtn.classList.add("btn-secondary");
      downloadPdfBtn.classList.remove("btn-primary");
    }

    tabFront.classList.toggle("is-active", activeSide === "front");
    tabFront.setAttribute("aria-selected", String(activeSide === "front"));
    tabBack.classList.toggle("is-active", activeSide === "back");
    tabBack.setAttribute("aria-selected", String(activeSide === "back"));
  }

  function renderCard() {
    const title = titleInput.value;
    cardStage.innerHTML =
      activeSide === "front" ? buildFrontCardHtml(title) : buildBackCardHtml(title);
    updateUiState();
  }

  tabFront.addEventListener("click", () => {
    activeSide = "front";
    renderCard();
  });

  tabBack.addEventListener("click", () => {
    activeSide = "back";
    renderCard();
  });

  randomizeBtn.addEventListener("click", () => {
    generateTableData();
    renderCard();
  });

  titleInput.addEventListener("input", () => {
    renderCard();
  });

  function triggerPdfDownload(format) {
    if (!gridData) return;
    window.downloadAuthCardsPdf(
      titleInput.value,
      gridData,
      ICONS.map((icon) => icon.name),
      format
    );
  }

  downloadPdfBtn.addEventListener("click", () => {
    if (!gridData) return;
    downloadMenuOpen = !downloadMenuOpen;
    downloadMenu.classList.toggle("is-open", downloadMenuOpen);
    downloadMenu.setAttribute("aria-hidden", String(!downloadMenuOpen));
    downloadPdfBtn.setAttribute("aria-expanded", String(downloadMenuOpen));
  });

  downloadMenu.querySelectorAll("[data-pdf-format]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const format = btn.getAttribute("data-pdf-format");
      triggerPdfDownload(format);
      downloadMenuOpen = false;
      downloadMenu.classList.remove("is-open");
      downloadMenu.setAttribute("aria-hidden", "true");
      downloadPdfBtn.setAttribute("aria-expanded", "false");
    });
  });

  function syncResponsiveLayout() {
    if (mobileQuery.matches) {
      if (rightPanel.parentElement !== mobilePreviewSlot) {
        mobilePreviewSlot.appendChild(rightPanel);
      }
      mobilePreviewDrawer.classList.toggle("is-open", mobilePreviewOpen);
      mobilePreviewDrawer.setAttribute("aria-hidden", String(!mobilePreviewOpen));
      mobilePreviewBtn.setAttribute("aria-expanded", String(mobilePreviewOpen));
      mobilePreviewBtn.textContent = mobilePreviewOpen ? "Verberg preview" : "Preview kaartje";
    } else {
      if (rightPanel.parentElement !== workspace) {
        workspace.appendChild(rightPanel);
      }
      mobilePreviewDrawer.classList.remove("is-open");
    }
  }

  mobilePreviewBtn.addEventListener("click", () => {
    mobilePreviewOpen = !mobilePreviewOpen;
    syncResponsiveLayout();
  });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", syncResponsiveLayout);
  } else {
    mobileQuery.addListener(syncResponsiveLayout);
  }

  // Inklapbare infokaarten (desktop, tablet & mobiel)
  document.querySelectorAll("[data-accordion]").forEach((card) => {
    const toggle = card.querySelector(".info-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  syncResponsiveLayout();
  renderCard();
})();
