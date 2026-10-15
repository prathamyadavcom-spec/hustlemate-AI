const $ = (id) => document.getElementById(id);

let localGenerator = null;
let currentListingText = "";

const views = {
  overview: $("overviewView"),
  listing: $("listingView"),
  invoice: $("invoiceView"),
  profit: $("profitView")
};

function toast(message) {
  const node = $("toast");
  node.textContent = message;
  node.classList.add("show");

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    node.classList.remove("show");
  }, 2800);
}

function navigate(viewName) {
  if (!views[viewName]) return;

  Object.entries(views).forEach(([key, view]) => {
    view.classList.toggle("active", key === viewName);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  const pageNames = {
    overview: "Overview",
    listing: "Listing Writer",
    invoice: "Invoice Maker",
    profit: "Profit Calculator"
  };

  $("breadcrumbPage").textContent = pageNames[viewName];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.view));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.go));
});

// Load an open-weight model in the browser using Transformers.js.
async function loadLocalModel() {
  const button = $("loadModelBtn");
  const status = $("modelStatus");

  button.disabled = true;
  button.textContent = "Loading model...";
  status.textContent = "Downloading open model...";

  try {
    const { pipeline, env } = await import(
      "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2"
    );

    env.allowLocalModels = false;

    localGenerator = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-small",
      {
        progress_callback: (progress) => {
          if (
            progress &&
            progress.status === "progress" &&
            Number.isFinite(progress.progress)
          ) {
            status.textContent =
              `Loading model ${Math.round(progress.progress)}%`;
          }
        }
      }
    );

    status.textContent = "Local model ready";
    button.textContent = "Local AI ready ✓";
    button.disabled = false;

    toast("Open-weight AI is ready in your browser.");
  } catch (error) {
    console.error(error);

    status.textContent = "Demo mode available";
    button.textContent = "Retry local AI";
    button.disabled = false;

    toast("Model failed to load. The template fallback is still available.");
  }
}

$("loadModelBtn").addEventListener("click", loadLocalModel);

function cleanText(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

// Fallback listing if the AI model has not been loaded.
function fallbackListing(data) {
  const details = data.details ||
    "Made with care, with thoughtful details for everyday use.";

  const audience = data.audience ||
    "people who value useful, well-made products";

  return `${data.name}

${data.name} brings together thoughtful design and everyday usefulness.
${details}

Why you'll love it:
• A distinctive ${data.category.toLowerCase()} product
• A practical option for ${audience}
• A thoughtful choice for personal use or gifting

Made for ${audience}, this product is ready to become part of your
everyday routine.

Before publishing, add verified dimensions, materials, care instructions
and shipping details.

Search tags: ${data.name.toLowerCase()},
${data.category.toLowerCase()}, thoughtful gift, everyday essentials`;
}

async function createListing(data) {
  if (!localGenerator) {
    return fallbackListing(data);
  }

  const prompt = `
    Write an honest ecommerce product listing.
    Product: ${data.name}.
    Category: ${data.category}.
    Audience: ${data.audience || "general customers"}.
    Seller details: ${data.details || "No extra details supplied"}.
    Tone: ${data.tone}.
    Platform: ${data.platform}.
    Include a short title, description, 3 benefits and 5 search tags.
    Do not invent materials, certifications, measurements or guarantees.
  `;

  const result = await localGenerator(prompt, {
    max_new_tokens: 180,
    do_sample: false
  });

  return result?.[0]?.generated_text?.trim() || fallbackListing(data);
}

$("listingForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    name: cleanText($("productName").value),
    category: $("productType").value,
    audience: cleanText($("audience").value),
    details: cleanText($("productDetails").value),
    tone: $("listingTone").value,
    platform: $("listingPlatform").value
  };

  const output = $("listingOutput");
  output.className = "output-content";
  output.textContent = localGenerator
    ? "Generating with local AI..."
    : "Preparing your listing draft...";

  try {
    currentListingText = await createListing(data);
  } catch (error) {
    console.error(error);
    currentListingText = fallbackListing(data);
    toast("AI failed. A template draft was created.");
  }

  output.textContent = currentListingText;
  output.className = "output-content";
  $("copyListingBtn").disabled = false;
  $("downloadListingBtn").disabled = false;

  if (localGenerator) {
    toast("Listing generated locally.");
  } else {
    toast("Template listing created. Load AI for model-based generation.");
  }
});

// Copy generated listing.
$("copyListingBtn").addEventListener("click", async () => {
  if (!currentListingText) return;

  try {
    await navigator.clipboard.writeText(currentListingText);
    toast("Listing copied to clipboard.");
  } catch (error) {
    toast("Clipboard blocked. Select and copy the text manually.");
  }
});

// Download generated listing as a text file.
$("downloadListingBtn").addEventListener("click", () => {
  if (!currentListingText) return;

  downloadText("hustlemate-product-listing.txt", currentListingText);
});

function downloadText(filename, text) {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

// Format numbers as Indian Rupees.
function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number.isFinite(value) ? value : 0);
}

function safeNumber(id) {
  const value = Number($(id).value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

// Profit calculator.
function updateProfit() {
  const price = safeNumber("sellingPrice");
  const costs =
    safeNumber("unitCost") +
    safeNumber("packagingCost") +
    safeNumber("otherCost");

  const units = Math.floor(safeNumber("monthlyUnits"));
  const profit = price - costs;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  const monthly = profit * units;

  $("unitProfit").textContent = money(profit);
  $("marginValue").textContent = `${margin.toFixed(1)}%`;
  $("monthlyProfit").textContent = money(monthly);

  $("profitLabel").textContent = profit >= 0
    ? "Before fixed costs and taxes"
    : "Your listed costs exceed the price";

  $("monthlyLabel").textContent =
    `${units.toLocaleString("en-IN")} units · before fixed costs and taxes`;

  if (price === 0) {
    $("insightTitle").textContent = "Add a selling price to begin.";
    $("insightText").textContent =
      "Enter a price above zero to calculate your estimated profit.";
  } else if (profit < 0) {
    $("insightTitle").textContent = "Your costs are above your price.";
    $("insightText").textContent =
      `Your costs exceed your selling price by ${money(Math.abs(profit))} per unit. Review your expenses or test a different price.`;
  } else if (margin < 20) {
    $("insightTitle").textContent = "Your margin may be tight.";
    $("insightText").textContent =
      "Check platform fees, taxes, refunds and overhead before deciding.";
  } else {
    $("insightTitle").textContent = "Your price has room to work.";
    $("insightText").textContent =
      `Your listed costs leave ${money(profit)} per unit before fixed costs and taxes. Validate customer demand before scaling.`;
  }
}

$("profitForm").addEventListener("input", updateProfit);

// Invoice maker.
function todayLocal() {
  const now = new Date();
  const local = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 10);
}

$("invoiceDate").value = todayLocal();

function escapeHTML(text) {
  return String(text ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderInvoice() {
  const business = cleanText($("businessName").value);
  const client = cleanText($("clientName").value);
  const number = cleanText($("invoiceNumber").value) || "HM-001";
  const date = $("invoiceDate").value || todayLocal();
  const description = cleanText($("invoiceDescription").value);

  const qty = Math.max(
    1,
    Math.floor(Number($("invoiceQty").value) || 1)
  );

  const rate = safeNumber("invoiceRate");
  const total = qty * rate;

  const notes = cleanText($("invoiceNotes").value) ||
    "Thank you for your business.";

  $("invoicePreview").innerHTML = `
    <div class="invoice-header">
      <div>
        <div class="invoice-brand">hustlemate<span>.</span></div>
        <p class="invoice-muted">${escapeHTML(business)}</p>
      </div>
      <div class="invoice-number">
        <strong>INVOICE</strong>
        <small>${escapeHTML(number)}<br>${escapeHTML(date)}</small>
      </div>
    </div>

    <div class="invoice-bill">
      <div>
        <span class="invoice-muted">BILL TO</span>
        <strong>${escapeHTML(client)}</strong>
      </div>
      <div style="text-align:right">
        <span class="invoice-muted">AMOUNT DUE</span>
        <strong>${money(total)}</strong>
      </div>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>DESCRIPTION</th>
          <th>QTY</th>
          <th>RATE</th>
          <th>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${escapeHTML(description)}</td>
          <td>${qty}</td>
          <td>${money(rate)}</td>
          <td>${money(total)}</td>
        </tr>
      </tbody>
    </table>

    <div class="invoice-total">
      <div><span>Subtotal</span><span>${money(total)}</span></div>
      <div class="grand"><span>Total due</span><span>${money(total)}</span></div>
    </div>

    <div class="invoice-notes">
      <strong>NOTES</strong><br>${escapeHTML(notes)}
    </div>
  `;
}

$("invoiceForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderInvoice();
  toast("Invoice generated. Use Print / PDF to save it.");
});

$("printInvoiceBtn").addEventListener("click", () => {
  if (!$("invoicePreview").querySelector(".invoice-header")) {
    toast("Complete the invoice form and generate a preview first.");
    return;
  }

  window.print();
});

updateProfit();