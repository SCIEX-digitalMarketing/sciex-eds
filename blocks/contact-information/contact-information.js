import getPartnersData from "../../scripts/blocks-controllers/partner-controller.js";

export default async function decorate(block) {

  /* ==========================================================
     1️⃣ INITIAL SETUP
  ========================================================== */

  const headingText = block.querySelector("p")?.textContent || "";

  await getPartnersData(); // Replace static data later if needed

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

  let selectedRegion = "";
  let selectedCountry = "";

  /* ==========================================================
     3️⃣ PREPARE ALL COUNTRIES LIST (FLATTENED)
  ========================================================== */

  const allCountries = data.flatMap(region =>
    region.countries.map(country => ({
      name: country.country,
      region: region.region
    }))
  );

  /* ==========================================================
     4️⃣ CUSTOM SELECT DROPDOWN
  ========================================================== */

  function setupCustomSelect(wrapper, items, onSelect) {
    const trigger = wrapper.querySelector(".select-trigger");
    const optionsContainer = wrapper.querySelector(".options");

    optionsContainer.innerHTML = "";

    items.forEach(item => {
      const option = document.createElement("div");
      option.className = "option";
      option.textContent = item;

      option.addEventListener("click", () => {
        trigger.firstChild.textContent = item + " ";
        wrapper.classList.remove("open");
        onSelect(item);
      });

      optionsContainer.appendChild(option);
    });

    trigger.onclick = () => {
      block.querySelectorAll(".custom-select").forEach(el => {
        if (el !== wrapper) el.classList.remove("open");
      });
      wrapper.classList.toggle("open");
    };
  }

  // Close dropdown when clicking outside ANY dropdown
  document.addEventListener("click", (e) => {
    block.querySelectorAll(".custom-select").forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  });

  /* ==========================================================
     5️⃣ FILTERING LOGIC
  ========================================================== */

  function filterData() {
    const searchValue = searchInput.value.toLowerCase();

    const filtered = data
      .filter(region =>
        (!selectedRegion || region.region === selectedRegion)
      )
      .map(region => ({
        ...region,
        countries: region.countries.filter(country =>
          (!selectedCountry || country.country === selectedCountry) &&
          (!searchValue ||
            country.country.toLowerCase().includes(searchValue))
        )
      }))
      .filter(region => region.countries.length > 0);

    renderCards(filtered);
  }

  /* ==========================================================
     6️⃣ RENDER CARDS
  ========================================================== */

  function renderCards(filteredData) {
    cardsContainer.innerHTML = "";

    filteredData.forEach(region => {
      region.countries.forEach(country => {
        country.companies.forEach(company => {
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
     7️⃣ REGION DROPDOWN
  ========================================================== */

  setupCustomSelect(
    regionWrapper,
    ["Select Region", ...data.map(r => r.region)],
    (value) => {

      selectedRegion = value === "Select Region" ? "" : value;

      // Reset country when region manually changed
      selectedCountry = "";
      countryWrapper.querySelector(".select-trigger")
        .firstChild.textContent = "Select Country ";

      filterData();
    }
  );

  /* ==========================================================
     8️⃣ COUNTRY DROPDOWN (ALL COUNTRIES BY DEFAULT)
  ========================================================== */

  setupCustomSelect(
    countryWrapper,
    ["Select Country", ...allCountries.map(c => c.name)],
    (countryVal) => {

      selectedCountry =
        countryVal === "Select Country" ? "" : countryVal;

      if (selectedCountry) {
        // Auto-detect region from selected country
        const match = allCountries.find(
          c => c.name === selectedCountry
        );

        selectedRegion = match?.region || "";

        // Update region dropdown UI
        regionWrapper.querySelector(".select-trigger")
          .firstChild.textContent =
          selectedRegion + " ";
      } else {
        selectedRegion = "";
        regionWrapper.querySelector(".select-trigger")
          .firstChild.textContent =
          "Select Region ";
      }

      filterData();
    }
  );

  /* ==========================================================
     9️⃣ SEARCH
  ========================================================== */

  searchInput.addEventListener("input", filterData);

  /* ==========================================================
     🔟 INITIAL RENDER
  ========================================================== */

  renderCards(data);
}