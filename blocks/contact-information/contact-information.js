export default function decorate(block) {
   

    const data = [

        {
            region: "North America",
            countries: [
                {
                    country: "Canada",
                    companies: [
                        {
                            name: "SCIEX",
                            legalEntity: "AB Sciex LP",
                            address:
                                "71 Four Valley Drive, Concord, Ontario, L4K 4V8, Canada",
                            productLine:
                                "Mass Spectrometry & Capillary Electrophoresis",
                            email: "sciexnow@sciex.com",
                            phone: "+1 877 740 2129",
                            website: "https://sciex.com/request-support",
                        },
                    ],
                },
                {
                    country: "United States",
                    companies: [
                        {
                            name: "SCIEX",
                            productLine: "Sales and Service",
                            address:
                                "1201 Radio Road, Redwood City, CA 94065, U.S.A.",
                            fax: "+1 800 343 1346",
                            productLine:
                                "Mass Spectrometry & Capillary Electrophoresis",
                            email: "sciexnow@sciex.com",
                            phone: "+1 877 740 2129",
                            website: "https://sciex.com/request-support",
                        },
                        {
                            name: "SCIEX",
                            productLine: "Headquarters",
                            legalEntity: "AB Sciex LLC",
                            address:
                                "250 Forest Street, Marlborough, MA 01752, U.S.A.",
                            fax: "+1 800 343 1346",
                            productLine:
                                "Mass Spectrometry & Capillary Electrophoresis",
                            email: "sciexnow@sciex.com",
                            phone: "+1 877 740 2129",
                            website: "https://sciex.com/request-support",
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
                            productLine: "Headquarters",
                            legalEntity: "AB Sciex LLC",
                            address:
                                "250 Forest Street, Marlborough, MA 01752, U.S.A.",
                            fax: "+1 800 343 1346",
                            productLine:
                                "Mass Spectrometry & Capillary Electrophoresis",
                            email: "sciexnow@sciex.com",
                            phone: "+1 877 740 2129",
                            website: "https://sciex.com/request-support",
                        },
                        {
                            name: "SCIEX",
                            productLine: "Headquarters",
                            legalEntity: "AB Sciex LLC",
                            address:
                                "250 Forest Street, Marlborough, MA 01752, U.S.A.",
                            fax: "+1 800 343 1346",
                            productLine:
                                "Mass Spectrometry & Capillary Electrophoresis",
                            email: "sciexnow@sciex.com",
                            phone: "+1 877 740 2129",
                            website: "https://sciex.com/request-support",
                        }
                    ],
                },
                {
                    country: "Angola",
                    companies: [
                        {
                            name: "SCIEX",
                            productLine: "Headquarters",
                            legalEntity: "AB Sciex LLC",
                            address:
                                "250 Forest Street, Marlborough, MA 01752, U.S.A.",
                            fax: "+1 800 343 1346",
                            productLine:
                                "Mass Spectrometry & Capillary Electrophoresis",
                            email: "sciexnow@sciex.com",
                            phone: "+1 877 740 2129",
                            website: "https://sciex.com/request-support",
                        }

                    ],
                },
            ],
        },


    ]

    /* -----------------------------
        BUILD UI
    ----------------------------- */

    block.innerHTML = `
    <div class="contact-wrapper">
      <h2>Select your region to find contact information for your area</h2>

      <input type="text" placeholder="Search by country" class="search-input"/>

      <div class="filters">
        <select class="region-select">
          <option value="">Select Region</option>
        </select>

        <select class="country-select">
          <option value="">Select Country</option>
        </select>
      </div>

      <div class="cards"></div>
    </div>
  `;

    const regionSelect = block.querySelector(".region-select");
    const countrySelect = block.querySelector(".country-select");
    const cardsContainer = block.querySelector(".cards");
    const searchInput = block.querySelector(".search-input");

    /* -----------------------------
        Populate Region Dropdown
    ----------------------------- */

    data.forEach((r) => {
        const option = document.createElement("option");
        option.value = r.region;
        option.textContent = r.region;
        regionSelect.appendChild(option);
    });

    /* -----------------------------
        Render Cards
    ----------------------------- */

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
            <p>${company.address}</p>
           
          `;

                    cardsContainer.appendChild(card);
                });
            });
        });
    }

    /* -----------------------------
        FILTER LOGIC
    ----------------------------- */

    function filterData() {
        const selectedRegion = regionSelect.value;
        const selectedCountry = countrySelect.value;
        const searchValue = searchInput.value.toLowerCase();

        let filtered = data;

        if (selectedRegion) {
            filtered = data.filter((r) => r.region === selectedRegion);
        }

        if (selectedCountry) {
            filtered = filtered.map((r) => ({
                ...r,
                countries: r.countries.filter(
                    (c) => c.country === selectedCountry
                ),
            }));
        }

        if (searchValue) {
            filtered = filtered.map((r) => ({
                ...r,
                countries: r.countries.filter((c) =>
                    c.country.toLowerCase().includes(searchValue)
                ),
            }));
        }

        renderCards(filtered);
    }

    /* -----------------------------
        Region Change
    ----------------------------- */

    regionSelect.addEventListener("change", () => {
        const selectedRegion = regionSelect.value;

        countrySelect.innerHTML =
            `<option value="">Select Country</option>`;

        if (selectedRegion) {
            const regionObj = data.find(
                (r) => r.region === selectedRegion
            );

            regionObj.countries.forEach((c) => {
                const option = document.createElement("option");
                option.value = c.country;
                option.textContent = c.country;
                countrySelect.appendChild(option);
            });
        }

        filterData();
    });

    /* -----------------------------
        Country Change
    ----------------------------- */

    countrySelect.addEventListener("change", filterData);

    /* -----------------------------
        Search
    ----------------------------- */

    searchInput.addEventListener("input", filterData);

    /* -----------------------------
        Initial Render (Show ALL)
    ----------------------------- */

    renderCards(data);
}