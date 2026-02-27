import getPartnersData from "../../scripts/blocks-controllers/partner-controller.js";

export default async function decorate(block) {
  /* ==========================================================
     1️⃣ INITIAL SETUP
  ========================================================== */

  const headingText = block.querySelector("p")?.textContent || "";

  // If you later want API data, replace static `data` with this
  await getPartnersData();

  // Static data (can be replaced by API response)
  const data = [
    {
      region: "North America",
      countries: [
        {
          country: "Canada",
          companies: [
            {
              name: "SCIEX",
              address:
                "7231 Four Valley Drive\nConcord, Ontario, L4K 4V8\nCanada",
              productLine:
                "Mass Spectrometry & Capillary Electrophoresis",
            },
          ],
        },
        {
          country: "United States",
          companies: [
            {
              name: "SCIEX",
              address:
                "7231 Four Valley Drive\nConcord, Ontario, L4K 4V8\nCanada",
              productLine: "Sales and Service",
            },
          ],
        },
      ],
    },
    {
      region: "EMEAI",
      countries: [
        {
          country: "Albania",
          companies: [
            {
              name: "SCIEX",
              address:
                "250 Forest Street, Marlborough, MA 01752, U.S.A.",
            },
          ],
        },
      ],
    },
  ];

  /* ==========================================================
     2️⃣ BUILD UI
  ========================================================== */

  block.innerHTML = `
    <div class="contact-wrapper">
      <h2>${headingText}</h2>

      <input type="text" placeholder="Search by country" class="search-input"/>

      <div class="filters">
        <div class="custom-select region-select">
          <div class="select-trigger">Select Region <span class="arrow"></span></div>
          <div class="options"></div>
        </div>

        <div class="custom-select country-select">
          <div class="select-trigger">Select Country <span class="arrow"></span></div>
          <div class="options"></div>
        </div>
      </div>

      <div class="cards"></div>
    </div>
  `;

  const regionWrapper = block.querySelector(".region-select");
  const countryWrapper = block.querySelector(".country-select");
  const cardsContainer = block.querySelector(".cards");
  const searchInput = block.querySelector(".search-input");

  // Selected state (single source of truth)
  let selectedRegion = "";
  let selectedCountry = "";

  /* ==========================================================
     3️⃣ CUSTOM SELECT (Reusable Dropdown Builder)
  ========================================================== */

function setupCustomSelect(wrapper, items, onSelect) {
  console.group("🔽 setupCustomSelect Init");
  console.log("Wrapper:", wrapper);
  console.log("Items:", items);
  console.groupEnd();

  const trigger = wrapper.querySelector(".select-trigger");
  const optionsContainer = wrapper.querySelector(".options");

  console.group("⚙ Elements Found");
  console.log("Trigger:", trigger);
  console.log("Options Container:", optionsContainer);
  console.groupEnd();

  // Reset options
  optionsContainer.innerHTML = "";
  console.log("🧹 Options container cleared");

  items.forEach((item, index) => {
    console.group(`📦 Creating Option ${index}`);
    console.log("Item:", item);

    const option = document.createElement("div");
    option.className = "option";
    option.textContent = item;

    option.addEventListener("click", () => {
      console.group("✅ Option Clicked");
      console.log("Selected Item:", item);

      trigger.firstChild.textContent = item;
      console.log("Trigger updated");

      wrapper.classList.remove("open");
      console.log("Dropdown closed");

      console.log("Calling onSelect callback");
      onSelect(item);
      console.groupEnd();
    });

    optionsContainer.appendChild(option);
    console.log("Option appended");
    console.groupEnd();
  });

  // Toggle dropdown open/close
  trigger.onclick = () => {
    console.group("🖱 Trigger Clicked");

    document.querySelectorAll(".custom-select").forEach((el) => {
      if (el !== wrapper) {
        el.classList.remove("open");
        console.log("Closed other dropdown");
      }
    });

    wrapper.classList.toggle("open");
    console.log("Is Open:", wrapper.classList.contains("open"));
    console.groupEnd();
  };
}

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  document.querySelectorAll(".custom-select").forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
      console.log("🚪 Closed (Outside Click)");
    }
  });
});

  /* ==========================================================
     4️⃣ FILTERING LOGIC (Optimized)
  ========================================================== */

  function filterData() {
    const searchValue = searchInput.value.toLowerCase();

    const filtered = data
      .filter((region) =>
        !selectedRegion || region.region === selectedRegion
      )
      .map((region) => ({
        ...region,
        countries: region.countries.filter((country) =>
          (!selectedCountry || country.country === selectedCountry) &&
          (!searchValue ||
            country.country.toLowerCase().includes(searchValue))
        ),
      }))
      .filter((region) => region.countries.length > 0);

    renderCards(filtered);
  }

  /* ==========================================================
     5️⃣ RENDER CARDS
  ========================================================== */

  function renderCards(filteredData) {
    cardsContainer.innerHTML = "";

    filteredData.forEach((region) => {
      region.countries.forEach((country) => {
        country.companies.forEach((company) => {
          const card = document.createElement("div");
          card.className = "contact-card";

          card.innerHTML = `
            <h3>${company.name}</h3>
            ${company.productLine ? `<p>${company.productLine}</p>` : ""}
            <p>${company.address.replace(/\n/g, "<br>")}</p>
          `;

          cardsContainer.appendChild(card);
        });
      });
    });
  }

  /* ==========================================================
     6️⃣ REGION DROPDOWN INITIALIZATION
  ========================================================== */

  setupCustomSelect(
    regionWrapper,
    ["Select Region", ...data.map((r) => r.region)],
    (value) => {
      // Update selected region
      selectedRegion = value === "Select Region" ? "" : value;

      // Whenever region changes → reset country
      selectedCountry = "";

      // Reset country dropdown UI label
      countryWrapper.querySelector(".select-trigger")
        .firstChild.textContent = "Select Country ";

      // Get selected region object
      const regionObj = data.find(
        (r) => r.region === selectedRegion
      );

      // Populate country dropdown
      setupCustomSelect(
        countryWrapper,
        selectedRegion
          ? ["Select Country", ...regionObj.countries.map((c) => c.country)]
          : ["Select Country"],
        (countryVal) => {
          selectedCountry =
            countryVal === "Select Country" ? "" : countryVal;
          filterData();
        }
      );

      filterData();
    }
  );

  /* ==========================================================
     7️⃣ SEARCH LISTENER
  ========================================================== */

  searchInput.addEventListener("input", filterData);

  /* ==========================================================
     8️⃣ INITIAL RENDER
  ========================================================== */

  renderCards(data);
}