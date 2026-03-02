import getPartnersData from "../../scripts/blocks-controllers/partner-controller.js";

export default async function decorate(block) {

  const headingText = block.querySelector("p")?.textContent || "";
  const data = await getPartnersData();

  block.innerHTML = `
    <div class="contact-wrapper">
      <h2 class="contact-title">${headingText}</h2>      
      <div class="search-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 3.06348C15.4181 3.06348 18.9997 6.72141 19 11.2334C19 13.3075 18.241 15.1997 16.9941 16.6406L20.3574 20.0752L20.707 20.4326L19.9922 21.1318L19.6426 20.7744L16.2949 17.3555C14.884 18.6295 13.0313 19.4043 11 19.4043L10.5879 19.3936C6.36114 19.1745 3 15.6045 3 11.2334C3.00034 6.72141 6.58193 3.06348 11 3.06348ZM11 4.06348C7.15396 4.06348 4.00034 7.25375 4 11.2334C4 15.2133 7.15375 18.4043 11 18.4043C14.8463 18.4043 18 15.2133 18 11.2334C17.9997 7.25375 14.846 4.06348 11 4.06348Z" fill="#141414"/>
        </svg>
        <input
            type="text"
            placeholder="Search by country"
            class="search-input"
            id="search-input"
        />
      </div>
      <button class="clear-button"></button>
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
  const filter=document.querySelector(".filters");

  let selectedRegion = "";
  let selectedCountry = "";

  const clearButton=block.querySelector(".clear-button");
  clearButton.innerHTML = `Clear All <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
    <path d="M13 13.5L3.0001 3.5001" stroke="#3C8DFF"/>
    <path d="M13 3.5L3.0001 13.4999" stroke="#3C8DFF"/>
  </svg>`;

  //custom dropdown setup
  function setupCustomSelect(wrapper, items, onSelect) {
    const trigger = wrapper.querySelector(".select-trigger");
    const optionsContainer = wrapper.querySelector(".options");
    optionsContainer.innerHTML = "";

    items.forEach((item) => {
      const option = document.createElement("div");
      option.className = "option";
      option.textContent = item;

      option.addEventListener("click", () => {
        trigger.firstChild.textContent = item;
        wrapper.classList.remove("open");
        onSelect(item);
      });

      optionsContainer.appendChild(option);
    });

    trigger.onclick = () => {  
      wrapper.classList.toggle("open");
    };
  }

  // Close the other trigger dropdown, if already opened
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".custom-select").forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
    });
  });
 
  function renderCards(filteredData, showUSDefault = false) {

    if (selectedRegion || selectedCountry || searchInput.value) {
      console.log("show clear")
      clearButton.style.display = "flex";
      filter.style.marginTop="0px";
    } else {
      console.log("hide clear")
      clearButton.style.display = "none";
      filter.style.marginTop="40px";
    }
    
    cardsContainer.innerHTML = "";
    
    // Show US if nothing selected or searched
    if (showUSDefault && !selectedRegion && !selectedCountry && !searchInput.value) {
      const usRegion = data.find(r => r.region === "North America");
      const usCountry = usRegion?.countries.find(c => c.country === "United States");
      if (usCountry) {
        usCountry.companies.forEach(company => {
          const card = document.createElement("div");
          card.className = "contact-card";
          card.innerHTML = `
            <h3 class="company-name">${company.name ?? ""}</h3>
            <p class="product-line">${company.productLine ?? ""}</p>
            <p class="address">${company.address ?? ""}</p>
          `;
          cardsContainer.appendChild(card);
        });
        return;
      }
    }

    filteredData.forEach(region => {
      region.countries.forEach(country => {
        country.companies.forEach(company => {
          const card = document.createElement("div");
          card.className = "contact-card";
          card.innerHTML = `
            <h3 class="company-name">${company.name ?? ""}</h3>
            <p class="product-line">${company.productLine ?? ""}</p>
            <p class="address">${company.address ?? ""}</p>
          `;
          cardsContainer.appendChild(card);
        });
      });
    });
  }
 
  function filterData() {
    const searchValue = searchInput.value.trim().toLowerCase();

    let filtered;

    if (searchValue) {
      selectedRegion = "";
      selectedCountry = "";
      regionWrapper.querySelector(".select-trigger").firstChild.textContent = "Select Region ";
      countryWrapper.querySelector(".select-trigger").firstChild.textContent = "Select Country ";

      filtered = data
        .map(region => ({
          ...region,
          countries: region.countries.filter(c =>
            c.country.toLowerCase().includes(searchValue)
          )
        }))
        .filter(region => region.countries.length > 0);

    } else {
      filtered = data
        .filter(region => !selectedRegion || region.region === selectedRegion)
        .map(region => ({
          ...region,
          countries: region.countries
          .filter(c =>
            !selectedCountry || c.country === selectedCountry
          )
        }))
        .filter(region => region.countries.length > 0);
    }

    renderCards(filtered, true);
  }

  // Clear button functionality
  clearButton.addEventListener("click", () => {
    selectedRegion="";
    selectedCountry="";
    searchInput.value=""
    regionWrapper.querySelector(".select-trigger").firstChild.textContent = "Select Region ";
    countryWrapper.querySelector(".select-trigger").firstChild.textContent = "Select Country ";
    setupCustomSelect(countryWrapper, ["Select Country"], () => {});
    filterData();
  })

  setupCustomSelect(
    regionWrapper,
    ["Select Region", ...data.map(r => r.region)],
    (value) => {
      selectedRegion = value === "Select Region" ? "" : value;
      selectedCountry = "";
      searchInput.value = "";

      countryWrapper.querySelector(".select-trigger").firstChild.textContent = "Select Country ";

      const regionObj = data.find(r => r.region === selectedRegion);
      setupCustomSelect(
        countryWrapper,
        selectedRegion ? ["Select Country", ...regionObj.countries.map(c => c.country)] : ["Select Country"],
        (countryVal) => {
          selectedCountry = countryVal === "Select Country" ? "" : countryVal;
          filterData();
        }
      );

      filterData();
    }
  );

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.trim().toLowerCase();

  if (searchValue) {
    // Clear dropdown selections
    selectedRegion = "";
    selectedCountry = "";

    // Reset dropdown labels
    regionWrapper.querySelector(".select-trigger").firstChild.textContent = "Select Region ";
    countryWrapper.querySelector(".select-trigger").firstChild.textContent = "Select Country ";

    setupCustomSelect(countryWrapper, ["Select Country"], () => {});
  }

  filterData();
});

  renderCards(data, true); // Show US by default
}