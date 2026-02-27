import getPartnersData from "../../scripts/blocks-controllers/partner-controller.js";

export default async function decorate(block) {
  /* ==========================================================
     1️⃣ INITIAL SETUP
  ========================================================== */

  const headingText = block.querySelector("p")?.textContent || "";

  // If you later want API data, replace static `data` with this
  await getPartnersData();

  // Static data (can be replaced by API response)
  const data =[ {
  "region" : "EMEAI",
  "countries" : [ {
    "country" : "Albania",
    "companies" : [ {
      "name" : "ANTISEL-A. SELIDIS BROS SA",
      "address" : "Antisel - A. Selidis Bros S.A. SPECTRA Building 12th klm Thessalonikis N. Moudanion, 57001 Thermi, Thessaloniki, Hellas Greece Fax: +30 231 032 1912",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "antisel@antisel.gr",
      "phone" : "+30 231 032 2525",
      "website" : "www.antisel.gr"
    } ]
  }, {
    "country" : "Angola",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Austria",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "Legal Entity: AB Sciex Austria GmbH Hernalser Haupstrasse 219 A-1170 Wien Austria Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Toll free number: 00800 2255 2279 Fax: 0820 401 177000. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+43 800 296 4500",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Azerbaijan",
    "companies" : [ {
      "name" : "3A Analytics Limited Liability Company",
      "address" : "AZ1117, Baku City, Binagadi District, Bilajari Settlement, Fuzuli, house 1",
      "productLine" : "Mass Spectrometry",
      "email" : "mail@3aan.az",
      "phone" : "+994 (10) 711 21 35",
      "website" : "https://3aan.az"
    } ]
  }, {
    "country" : "Bahrain",
    "companies" : [ {
      "name" : "Al Zahrawi Medical Supplies",
      "address" : "Al Zahrawi Medical LLC. P.O. Box: 63065, Doha, Qatar Fax: +974 4436 5216 Mobile: +974 55 1226939",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@zahrawimedical.com",
      "phone" : "+974 4431 0571/0872",
      "website" : "www.zahrawimedical.com"
    } ]
  }, {
    "country" : "Bangladesh",
    "companies" : [ {
      "name" : "OMC Limited",
      "address" : "Unique Trade Center (UTC), Level 15, 8 Panthapath, Dhaka 1215, Bangladesh",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@omcbd.com",
      "phone" : "+88 09602666662",
      "website" : "https://www.omcbd.com/"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX India Private Limited, Unit No. 9215, B WING, 3RD FLOOR, ART GUILD HOUSE, PHOENIX MARKET CITY, LBS RD, Kurla, Mumbai, Maharashtra, India",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "marketing.india@sciex.com",
      "phone" : "+91 1 800 419 6940",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Belgium",
    "companies" : [ {
      "name" : "Analis SA/NV",
      "address" : "Analis SA/NV Rue de Néverlée 11 5020 Suarlee Belgium Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Capillary Electrophoresis",
      "email" : "guy.stukkens@analis.be",
      "phone" : "+ 32 81 25 50 50",
      "website" : "www.analis.be"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Belgium NV c/o AB Sciex Netherlands B.V. Eerste Tochtweg 11 (3rd floor) P.O. Box 330, 2910 AH Nieuwerkerk aan den Ijssel The Netherlands Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Toll free number: 00800 2255 2279 Fax: 32 0 2 503 3403. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry",
      "email" : "sciexnow@sciex.com",
      "phone" : "+32 2 503 3802",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Benin",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Bosnia Herzegovina",
    "companies" : [ {
      "name" : "East Diagnostics",
      "address" : "East Diagnostics, Mike Alasa 19, 11000 Belgrade, Republic of Serbia",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "office@east-diagnostics.com",
      "phone" : "+381 63 59 47 36",
      "website" : "https://east-diagnostics.com/"
    } ]
  }, {
    "country" : "Botswana",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Bulgaria",
    "companies" : [ {
      "name" : "AQUACHIM AD",
      "address" : "AQUACHIM AD Boulevard \"Professor Tsvetan Lazarov\" 83, 1582 g.k. Druzhba 1, Sofia Bulgaria Fax: +359 2 807 50 50",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "aquachim@aquachim.bg",
      "phone" : "+359 2 807 50 00",
      "website" : "www.aquachim.bg"
    }, {
      "name" : "Chromtek Ltd.",
      "address" : "Bulgaria, 1404 Sofia, 105A, blvd. Bulgaria, building 1, entrance A, floor 4, office 12.",
      "productLine" : "Mass Spectrometry",
      "email" : "sales@chromtek.bg",
      "phone" : "+359 899 366 651",
      "website" : "https://www.chromtek.bg"
    } ]
  }, {
    "country" : "Burkina Faso",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Burundi",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Cameroon",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Cape Verde",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Central African Republic",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Chad",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Comoros",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Congo (Brazzaville)",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Congo (Democratic Republic)",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Côte d'Ivoire",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Croatia",
    "companies" : [ {
      "name" : "Inel-Medicinska Tehnika d.o.o.",
      "address" : "Inel-medicinska tehnika d.o.o. Turinina 5, 10010 Zagreb Croatia Fax: +385 1 6520 966",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@inel-mt.hr",
      "phone" : "+385 1 6175 150/160",
      "website" : "www.inel-mt.hr"
    } ]
  }, {
    "country" : "Cyprus",
    "companies" : [ {
      "name" : "ANTISEL-A. SELIDIS BROS SA",
      "address" : "Antisel - A. Selidis Bros S.A. SPECTRA Building 12th klm Thessalonikis N. Moudanion, 57001 Thermi, Thessaloniki, Hellas Greece Fax: +30 231 032 1912",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "antisel@antisel.gr",
      "phone" : "+30 231 032 2525",
      "website" : "www.antisel.gr"
    }, {
      "name" : "ROTAKIM ANALIZ HIZMETLERI LTD. STI",
      "address" : "Mustafa Kemal Mahallesi, 2140.cadde No:1 Daire :16 Çankaya / ANKARA",
      "productLine" : "Mass Spectrometry",
      "email" : "info@rotakim.com",
      "phone" : "+90 312 284 59 00",
      "website" : "www.rotakim.com"
    } ]
  }, {
    "country" : "Czech Republic",
    "companies" : [ {
      "name" : "AMEDIS, spol. s r.o.",
      "address" : "AMEDIS, spol. Ltd. Bobkova 786 787 19800 Praha 9 Czech Republic Fax: +420 281 917 500",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sales@amedis.cz",
      "phone" : "+420 281 918 191",
      "website" : "www.amedis.cz"
    } ]
  }, {
    "country" : "Denmark",
    "companies" : [ {
      "name" : "Ramcon A/S",
      "address" : "Ramcon Bregnerodvej 132 3460 Birkerod Denmark Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Fax: +45 45 94 20 02. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Capillary Electrophoresis",
      "email" : "ramcon@ramcon.dk",
      "phone" : "+45 45 94 20 00",
      "website" : "www.ramcon.dk"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex ApS PO Box 224 0900 Copenhagen Denmark Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Fax: +45 8088 6778. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry",
      "email" : "sciexnow@sciex.com",
      "phone" : "+45 8088 6557",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Djibouti",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Egypt",
    "companies" : [ {
      "name" : "Agitech",
      "address" : "Arabian Group for Integrated Technologies Agitech Unit 10, 2nd Floor, Building S3, Downtown Katamya 90th Street, Fifth Settlement, New Cairo 11835, Cairo, Egypt Fax: +20 (202) 2314 6330",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@agitech-eg.com",
      "phone" : "+20 22314 6326/27/28/29",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "Equatorial Guinea",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Eritrea",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Eswatini",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Ethiopia",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Finland",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: A/B Sciex OY PO Box 5430 00002 Helsinki Finland Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Fax: +358 207 818 010. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry",
      "email" : "sciexnow@sciex.com",
      "phone" : "+358 800 552 024",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "France",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "Life Sciences Holdings France SAS SCIEX 15 avenue de Norvège 91140 Villebon sur Yvette France Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Toll free number: 00800 2255 2279 Fax:+33 00800 2255 2271. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+33 (0) 805 089472",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Gabon",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Georgia",
    "companies" : [ {
      "name" : "3A Analytics Limited Liability Company",
      "address" : "AZ1117, Baku City, Binagadi District, Bilajari Settlement, Fuzuli, house 1",
      "productLine" : "Mass Spectrometry",
      "email" : "mail@3aan.az",
      "phone" : "+994 (10) 711 21 35",
      "website" : "https://3aan.az"
    } ]
  }, {
    "country" : "Germany",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Germany GmbH Landwehrstrasse 54 64293 Darmstadt Germany Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Toll free number: 00800 2255 2279 Fax: 49 6151 35200 99 / 00800 22 55 22 71. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+49 (0) 6151 35 200 5815",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Ghana",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Greece",
    "companies" : [ {
      "name" : "ANTISEL-A. SELIDIS BROS SA",
      "address" : "Antisel - A. Selidis Bros S.A. SPECTRA Building 12th klm Thessalonikis N. Moudanion, 57001 Thermi, Thessaloniki, Hellas Greece Fax: +30 231 032 1912",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "antisel@antisel.gr",
      "phone" : "+30 231 032 2525",
      "website" : "www.antisel.gr"
    }, {
      "name" : "LERIVA DIAGNOSTICS SA",
      "address" : "LERIVA DIAGNOSTICS S.A. 33 Pigis Avenue and Anapiron Polemou Street 15127 Melissa, Athens Greece Email: apapavasiliou@leriva.com Fax: +30 210 61 78 733",
      "productLine" : "Capillary Electrophoresis",
      "email" : "akoliopanos@leriva.com;",
      "phone" : "+30 210 61 99 886",
      "website" : "www.leriva.com"
    } ]
  }, {
    "country" : "Guinea",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Guinea-Bissau",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Hungary",
    "companies" : [ {
      "name" : "Bio-Science Ltd.",
      "address" : "Bio-Science Andor u. 47-49 1119 Budapest Hungary Fax: 06 1 463 5261",
      "productLine" : "Capillary Electrophoresis",
      "email" : "tatrai.agnes@bio-science.hu",
      "phone" : "+36 6 1 463 5277",
      "website" : "www.bioscience.hu"
    }, {
      "name" : "Per-Form Hungária Kft.",
      "address" : "PER-FORM Hungária Kft. H-1142 Budapest Ungvár u. 43. Hungary Fax: +3612511461",
      "productLine" : "Mass Spectrometry",
      "email" : "perform@per-form.hu",
      "phone" : "+36 12511116",
      "website" : "www.per-form.hu"
    } ]
  }, {
    "country" : "Iceland",
    "companies" : [ {
      "name" : "Ramcon A/S",
      "address" : "Ramcon Bregnerodvej 132 3460 Birkerod Denmark Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Fax: +45 45 94 20 02. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Capillary Electrophoresis",
      "email" : "ramcon@ramcon.dk",
      "phone" : "+45 45 94 20 00",
      "website" : "www.ramcon.dk"
    } ]
  }, {
    "country" : "India",
    "companies" : [ {
      "name" : "Dwell Instruments",
      "address" : "C 3506 Tirumala Habitats Gowardhan Nagar LBS Marg Mulund West Mumbai 400080",
      "productLine" : "Mass Spectrometry",
      "email" : "",
      "phone" : "",
      "website" : ""
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX India Private Limited, Unit No. 9215, B WING, 3RD FLOOR, ART GUILD HOUSE, PHOENIX MARKET CITY, LBS RD, Kurla, Mumbai, Maharashtra, India",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "India.marketing@sciex.com",
      "phone" : "+91 1800-419-6940",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "Ireland",
    "companies" : [ {
      "name" : "Labplan Limited",
      "address" : "Labplan Allenwood Business Park W91 A4CP Co Kildare Ireland Mon-Thu: 8:00 AM-4:00 PM Fri: 8:00 AM-3:00 PM Fax: +353 45 870 811. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Capillary Electrophoresis",
      "email" : "info@labplan.ie",
      "phone" : "+353 45 870 560",
      "website" : "www.labplan.ie"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX UK Centre of Innovation, Suite 21F18, Mereside, Alderley Park, Macclesfield, Cheshire, SK10 4TG, United Kingdom Mon-Thu: 8:00 AM-4:00 PM Fri: 8:00 AM-3:00 PM Toll free number: 00800 2255 2279. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry",
      "email" : "sciexnow@sciex.com",
      "phone" : "0080022552279 / Toll free number: 00800 2255 2279",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "Israel",
    "companies" : [ {
      "name" : "Rhenium Medical Ltd.",
      "address" : "20 Hasatat, P.O.B 180, Modi’in 7171101, Israel",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "",
      "phone" : "+972-8-955-8888",
      "website" : "https://www.rhenium.co.il/"
    } ]
  }, {
    "country" : "Italy",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "AB SCIEX SRL: Piazzale Francesco Baracca 1,20123 - Milano, Italy",
      "productLine" : "Mass Spectrometry",
      "email" : "sciexnow@sciex.com",
      "phone" : "+39 800 789 914",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "Jordan",
    "companies" : [ {
      "name" : "Memcorp",
      "address" : "Medical Equipment & Maintenance Co.Jabal Al-Hussein Al-Razi Street Bldg.95 P.O. Box 926984, Amman 11110",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@memcorpjo.com",
      "phone" : "+962 6 5604812 - 5604819 - 5603992",
      "website" : "www.memcorpjo.com"
    } ]
  }, {
    "country" : "Kazakhstan",
    "companies" : [ {
      "name" : "Algimed Kazakhstan",
      "address" : "Astana, Saryarka district, Auezov str., 8, of. 701 (BC \"Asia\")",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "mail@algimed.by",
      "phone" : "+7 717 277 99 71 / +7 700 613 13 07",
      "website" : "www.algimed.com"
    } ]
  }, {
    "country" : "Kenya",
    "companies" : [ {
      "name" : "Kenya -  Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    }, {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Kosovo",
    "companies" : [ {
      "name" : "East Diagnostics",
      "address" : "East Diagnostics, Mike Alasa 19, 11000 Belgrade, Republic of Serbia",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "office@east-diagnostics.com",
      "phone" : "+381 63 59 47 36",
      "website" : "https://east-diagnostics.com/"
    } ]
  }, {
    "country" : "Kuwait",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX, Ahmad Kazim Complex, building number 33, 3rd Floor, Oud Metha, Bur Dubai, Dubai Healthcare City, PO Box 71569, Dubai, United Arab Emirates",
      "productLine" : "Mass Spectrometry & Capillary electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+971 4 55 08688",
      "website" : "India.marketing@sciex.com"
    }, {
      "name" : "SCIEX",
      "address" : "DHR MENA FZ-LLC Al Zahrawi, Building No. 34, Unit 201 and 301, Dubai Health Care City, P.O.Box 71569, Dubai, UAE",
      "productLine" : "Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+971 4 55 08688",
      "website" : "www.sciex.com/request-support"
    } ]
  }, {
    "country" : "Latvia",
    "companies" : [ {
      "name" : "SIA BioAvots",
      "address" : "SIA BioAvots A.Deglava iela 66 (Deglava biznesa centrs) Rīga, LV-1035 Latvia Fax: +371 67585030",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@bioavots.lv",
      "phone" : "+371 67585060 / +371 24422742",
      "website" : "www.bioavots.lv"
    } ]
  }, {
    "country" : "Lebanon",
    "companies" : [ {
      "name" : "Numelab s. a. r. l.",
      "address" : "NUMELAB s.a.r.l. 171 Sami El Solh Avenue, Beirut Lebanon Fax + 961 1 39 66 88",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@numelab.com",
      "phone" : "+961 1 39 66 77",
      "website" : "https://www.numelab.com/"
    } ]
  }, {
    "country" : "Lesotho",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Liberia",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Lithuania",
    "companies" : [ {
      "name" : "Linea Libera UAB",
      "address" : "UAB “Linea Libera” Akademijos g. 2 LT-08412 Vilnius Lithuania Fax: +370 5 263 8749",
      "productLine" : "Mass Spectrometry",
      "email" : "info@linealibera.lt",
      "phone" : "+370 5 263 8748",
      "website" : "http://www.linealibera.lt/"
    } ]
  }, {
    "country" : "Luxembourg",
    "companies" : [ {
      "name" : "Analis SA/NV",
      "address" : "Analis SA/NV Rue de Néverlée 11 5020 Suarlee Belgium Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM",
      "productLine" : "Capillary Electrophoresis",
      "email" : "guy.stukkens@analis.be",
      "phone" : "+ 32 81 25 50 50",
      "website" : "www.analis.be"
    } ]
  }, {
    "country" : "Macedonia",
    "companies" : [ {
      "name" : "East Diagnostics",
      "address" : "East Diagnostics, Mike Alasa 19, 11000 Belgrade, Republic of Serbia",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "office@east-diagnostics.com",
      "phone" : "+381 63 59 47 36",
      "website" : "https://east-diagnostics.com/"
    } ]
  }, {
    "country" : "Madagascar",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Malawi",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Mali",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Malta",
    "companies" : [ {
      "name" : "Evolve Ltd",
      "address" : "45,Gwann Mamo Street Luqua LQA 1251",
      "productLine" : "Capillary Electrophoresis",
      "email" : "info@evolveltd.eu",
      "phone" : "+356 2248 9900",
      "website" : "https://evolveltd.eu"
    } ]
  }, {
    "country" : "Mauritania",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Mauritius",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Moldova",
    "companies" : [ {
      "name" : "ANTISEL RO",
      "address" : "ANTISEL RO Șoseaua Dudești-Pantelimon 42, Sector 3, 033094, Bucharest, Romania",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "antisel@antisel.ro",
      "phone" : "+40 21 300 11 12",
      "website" : "www.antisel.ro"
    } ]
  }, {
    "country" : "Montenegro",
    "companies" : [ {
      "name" : "East Diagnostics",
      "address" : "East Diagnostics, Mike Alasa 19, 11000 Belgrade, Republic of Serbia",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "office@east-diagnostics.com",
      "phone" : "+381 63 59 47 36",
      "website" : "https://east-diagnostics.com/"
    } ]
  }, {
    "country" : "Morocco",
    "companies" : [ {
      "name" : "Isolab Maroc",
      "address" : "Lot n° 30, Parc Industriel CFCIM de Bouskoura,27182 Bouskoura,Maroc",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "isolab@isolabmaroc.com",
      "phone" : "+212 5 22 59 23 06/07/08/09",
      "website" : "http://isolabmaroc.ma/"
    } ]
  }, {
    "country" : "Mozambique",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Namibia",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Niger",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Nigeria",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Norway",
    "companies" : [ {
      "name" : "Ramcon A/S",
      "address" : "Ramcon Bregnerodvej 132 3460 Birkerod Denmark Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Fax: +45 45 94 20 02. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Capillary Electrophoresis",
      "email" : "ramcon@ramcon.dk",
      "phone" : "+45 45 94 20 00",
      "website" : "www.ramcon.dk"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex AS C/o Regus Cort Adelers gate 16 0254 Oslo Norway Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry",
      "email" : "sciexnow@sciex.com",
      "phone" : "+47 800 62 218",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "Poland",
    "companies" : [ {
      "name" : "BioAnalytic SP z.o.o",
      "address" : "Limbowa 7A, 80-175 Gdansk Poland",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "biuro@bioanalytic.com.pl",
      "phone" : "+48 58 345 78 78 / +48 58 340 99 79",
      "website" : "www.bioanalytic.com.pl"
    } ]
  }, {
    "country" : "Portugal",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "AB Sciex Portugal - Sociedade Unipessoal Lda. Avenida do Forte nº3 Edifício Suécia III, piso 0, sala 0.35 2790-073 Carnaxide Portugal Mon-Thu: 8:00 AM-4:00 PM Fri: 8:00 AM-3:00 PM Toll free number: 00800 2255 2279. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "00800 2255 2279",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Qatar",
    "companies" : [ {
      "name" : "Al Zahrawi Medical Supplies",
      "address" : "Al Zahrawi Medical LLC. P.O. Box: 63065, Doha, Qatar Fax: +974 4436 5216 Mobile: +974 55 1226939",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@zahrawimedical.com",
      "phone" : "+974 4431 0571/0872",
      "website" : "www.zahrawimedical.com"
    } ]
  }, {
    "country" : "Réunion",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Romania",
    "companies" : [ {
      "name" : "ANTISEL RO",
      "address" : "ANTISEL RO Șoseaua Dudești-Pantelimon 42, Sector 3, 033094, Bucharest, Romania",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "antisel@antisel.ro",
      "phone" : "+40 21 300 11 12",
      "website" : "www.antisel.ro"
    } ]
  }, {
    "country" : "Rwanda",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Sao Tome and Principe",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Saudi Arabia",
    "companies" : [ {
      "name" : "Al-Tuqarb Al-Almia (a.k.a Affinity)",
      "address" : "8150 AlMadinah AlMunwarah Road , Jeddah , Saudi Arabia PO.Box 4855-23215",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@aletqanhealth.com",
      "phone" : "09003884933",
      "website" : "https://aletqanhealth.com/"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX, Ahmad Kazim Complex, building number 33, 3rd Floor, Oud Metha, Bur Dubai, Dubai Healthcare City, PO Box 71569, Dubai, United Arab Emirates",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "durgesh.dhir@sciex.com",
      "phone" : "",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Senegal",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Serbia",
    "companies" : [ {
      "name" : "East Diagnostics",
      "address" : "East Diagnostics, Mike Alasa 19, 11000 Belgrade, Republic of Serbia",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "office@east-diagnostics.com",
      "phone" : "+381 63 59 47 36",
      "website" : "https://east-diagnostics.com/"
    } ]
  }, {
    "country" : "Sierra Leone",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Slovakia",
    "companies" : [ {
      "name" : "AMEDIS SK",
      "address" : "AMEDIS spol. s r.o. Mlynská 10 921 01 Piešťany Slovakia Fax: +421 33 7720 932",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "amedis.pn@amedis.sk",
      "phone" : "+421 33 7744 230",
      "website" : "https://www.amedis.sk/"
    } ]
  }, {
    "country" : "Slovenia",
    "companies" : [ {
      "name" : "Hermes Analitica d.o.o.",
      "address" : "Hermes Analitica Verovskova 58 1000 Ljubljana Slovenia Fax: +386 (0) 1 581 81 89",
      "productLine" : "Capillary Electrophoresis",
      "email" : "miran.fugina@hermes-analitica.si",
      "phone" : "+386 1 581 81 81",
      "website" : "www.hermes-analitica.si"
    }, {
      "name" : "Omega d.o.o.",
      "address" : "Omega d.o.o. Dolinskova 8 1000 Ljubljana Slovenia Fax: +386 1 4273191",
      "productLine" : "Mass Spectrometry",
      "email" : "omega@omega.si",
      "phone" : "+386 1 4273213",
      "website" : "http://www.omega.si/"
    } ]
  }, {
    "country" : "Somalia",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "South Africa",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Spain",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Spain S.L. Calle Valgrande 8 Planta 1a Puerta 1, 28108 Alcobendas Madrid, Spain Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "00800 2255 2279",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "Sri Lanka",
    "companies" : [ {
      "name" : "S&D Associates",
      "address" : "S&D Associates No 36, Old Kesbewa Road, Boralesgamuwa Sri Lanka",
      "productLine" : "Mass Spectrometry",
      "email" : "admin@sdchemlanka.com",
      "phone" : "+94 114 515 544 / +94 114 515 225",
      "website" : "www.sdcheme.com"
    } ]
  }, {
    "country" : "Sweden",
    "companies" : [ {
      "name" : "Ramcon A/S",
      "address" : "Ramcon Kvarnbygatan 12 SE-431 34 Mölndal Sweden Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM",
      "productLine" : "Capillary Electrophoresis",
      "email" : "ramcon@ramcon.se",
      "phone" : "+46 406 456 205",
      "website" : "www.ramcon.dk"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: A/B Sciex AB C/o Regus Engelbrektsgatan 9-11 11432 Stockholm Sweden Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Fax: +46 020 795 534. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry",
      "email" : "sciexnow@sciex.com",
      "phone" : "+46 20 795 753",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "Switzerland",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Switzerland GmbH c/o Voser Rechtsanwalte KIG Stadtturmstrasse 19 CH-5401, Baden Switzerland Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM . Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "00800 2255 2279",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Tanzania",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "The Gambia",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "The Netherlands",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Belgium NV c/o AB Sciex Netherlands B.V. Eerste Tochtweg 11 (3rd floor) P.O. Box 330, 2910 AH Nieuwerkerk aan den Ijssel The Netherlands Mon-Thu: 9:00 AM-5:00 PM Fri: 9:00 AM-4:00 PM Toll free number: 00800 2255 2279 Fax: 32 0 2 503 3403. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+32 2 503 3802",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Togo",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Tunisia",
    "companies" : [ {
      "name" : "Agitech",
      "address" : "Arabian Group for Integrated Technologies Agitech, Unit 10, 2nd Floor, Building S3, Downtown Katamya, 90th Street, Fifth Settlement, New Cairo 11835, Cairo, Egypt, Fax: +20 (202) 2314 6330",
      "productLine" : "Mass Spectrometry",
      "email" : "info@agitech-eg.com",
      "phone" : "+20 22314 6326/27/28/29",
      "website" : "https://sciex.com/request-support"
    }, {
      "name" : "STE Technolab",
      "address" : "Technolab 10, Rue des Ottomans 2091 MENZAH 6 ARIANA Tunisia Fax: 71767631",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "jdouiri@technolab.com.tn",
      "phone" : "+216 71766745 / 71751911",
      "website" : "httsp://sciex.com/request-support"
    } ]
  }, {
    "country" : "Türkiye",
    "companies" : [ {
      "name" : "AKA BIYOTEKNOLOJI",
      "address" : "AKA BIYOTEKNOLOJI MUH.ve DAN.SAN.TIC.LTD.STI Merkez Mh.Seçkin Sok. No:3 / 67 Dap Bumerang Ofis Kağıthane 34406 ISTANBUL Türkiye",
      "productLine" : "Capillary Electrophoresis",
      "email" : "info@akabiotech.com",
      "phone" : "+90 212 346 20 17 / +90 532 292 75 41",
      "website" : "www.akabiotech.com"
    }, {
      "name" : "ROTAKIM ANALIZ HIZMETLERI LTD. STI",
      "address" : "Mustafa Kemal Mahallesi, 2140.cadde No:1 Daire :16 Çankaya / ANKARA",
      "productLine" : "Mass Spectrometry",
      "email" : "info@rotakim.com",
      "phone" : "+90 312 284 59 00",
      "website" : "www.rotakim.com"
    } ]
  }, {
    "country" : "Uganda",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "United Arab Emirates",
    "companies" : [ {
      "name" : "Himatrix Measurements Equipments LLC",
      "address" : "PO Box 119396, Dubai, UAE Phone: +971 4 250 4236",
      "productLine" : "Mass Spectrometry",
      "email" : "santhosh@himatrix.com",
      "phone" : "+971 4 3392603",
      "website" : "https://www.himatrix.com/"
    } ]
  }, {
    "country" : "United Kingdom",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX UK Centre of Innovation, Suite 21F18, Mereside, Alderley Park, Macclesfield, Cheshire, SK10 4TG, United Kingdom Mon-Thu: 8:00 AM-4:00 PM Fri: 8:00 AM-3:00 PM Toll free number: 0808 273 8279. Office is closed: New Year's Day, Easter Monday, Labour Day, Ascension Day, Christmas Day, Boxing Day. Please contact us the following working day.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+44 161 802 0201",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Uzbekistan",
    "companies" : [ {
      "name" : "Algimed Uzbekistan",
      "address" : "Tashkent city, Yunusabad district, Small Ring Road, 22-24",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "mail@algimed.uz",
      "phone" : "+998 50 444 54 79",
      "website" : "www.algimed.com"
    } ]
  }, {
    "country" : "Zambia",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  }, {
    "country" : "Zimbabwe",
    "companies" : [ {
      "name" : "Promolab (Pty) Ltd - Separations",
      "address" : "Separations P O Box 4181 Randburg 2125, South Africa Fax: +27 11 919 1200",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@separations.co.za",
      "phone" : "+27 11 919 1000",
      "website" : "http://separations.co.za/"
    } ]
  } ]
}, {
  "region" : "Asia Pacific",
  "countries" : [ {
    "country" : "Japan",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: K.K. AB SCIEX Japan \n4-7-35 Kitashinagawa, Shinagawa-ku 140-0001 Tokyo Japan \nSupport Email: jp_support@sciex.com Fax: 0120 318 040",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "jp_sales@sciex.com",
      "phone" : "+81 0120 318 551",
      "website" : "https://sciex.jp"
    } ]
  }, {
    "country" : "Australia",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Australia Pty Ltd \nPO BOX 514 Mt Waverley, Victoria, 3149 Australia \nMon-Fri: 9:00 AM-5:00 PM AET Fax: +61 3 9560 7924",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "anz.orders@sciex.com",
      "phone" : "+61 1300 62 7777",
      "website" : "www.sciex.com"
    }, {
      "name" : "Fisher Biotec Pty Ltd",
      "address" : "198 Cambridge St. Wembley 6014 Australia",
      "productLine" : "Capillary Electrophoresis",
      "email" : "info@fisherbiotec.com",
      "phone" : "1 800 066 077",
      "website" : "https://www.fisherbiotec.com.au"
    } ]
  }, {
    "country" : "China",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: Shanghai Sciex Analytical Instrument Trading Co. \n5F Bldg #1, 518 North Fuquan Road IBP, Changning District Shanghai, PRC 200335 \nMon-Fri: 9:00 AM-5:00 PM \nEmail Service: service.china@sciex.com Support Hotline: 800 820 3488 Toll free number (for Desk phone): 800 820 3488 Toll free number (for Mobile phone): 400 821 3897",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "contactuschina@sciex.com",
      "phone" : "800 820 3488",
      "website" : "https://sciex.com.cn/"
    } ]
  }, {
    "country" : "Hong Kong SAR of China",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex (Hong Kong) Limited \nSuite 1605, 16th Floor, Tower 6 China Hong Kong City 33 Canton Road Tsimshatsui, Kowloon Hong Kong \nMon-Fri: 9:00 AM-5:30 PM Fax: 852 3102 0003",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "service.hongkong@sciex.com",
      "phone" : "852 3102 3000",
      "website" : "https://sciex.com.cn/"
    } ]
  }, {
    "country" : "Indonesia",
    "companies" : [ {
      "name" : "PT. LABORINDO SARANA",
      "address" : "Pt. Laborindo Sarana Jl. Arteri Pondok Indah No. 8A Jakarta 12240 Indonesia Fax: 62 21 725 7226",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sales@laborindo.com",
      "phone" : "+62 21 725 5165 / +62 21 725 7225",
      "website" : "www.laborindo.com"
    }, {
      "name" : "PT Megah Sejahtera Scientific",
      "address" : "Jl. Rajawali 58, Surabaya,  Jawa Timur",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "marketing@megahsejahtera.com",
      "phone" : "+62 031 5021 677",
      "website" : "http://megahsejahtera.com/"
    } ]
  }, {
    "country" : "Macau",
    "companies" : [ {
      "name" : "Professional Health Trading Company Ltd.",
      "address" : "Legal Entity: Professional Health Trading Company Ltd.\nEstrada D. Maria II No.3-21, 3 Andar D, Edif. Industrial Cheong Long, Macau",
      "productLine" : "Mass Spectrometry",
      "email" : "cs@prohealthltd.com",
      "phone" : "(853) 2852 9683",
      "website" : "https://sciex.com"
    } ]
  }, {
    "country" : "Malaysia",
    "companies" : [ {
      "name" : "Betatech Scientific Sdn Bhd (1133239-T)",
      "address" : "No. 29-2, Jalan Puteri 4/7A, Bandar Puteri, 47100 Puchong, Selangor, Malaysia",
      "productLine" : "Mass Spectrometry",
      "email" : "siahcl@betatechscientific.com",
      "phone" : "+6012–6765735",
      "website" : "https://www.betatechscientific.com"
    }, {
      "name" : "CVS Medical Sdn Bhd",
      "address" : "G-03-03, Plaza Kelana Jaya, Jalan SS7/13A, 47301 Petaling Jaya, Selangor",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "lowyc@cvsmedical.com.my",
      "phone" : "+603 7800 9039",
      "website" : "https://www.cvsmedical.com.my/"
    }, {
      "name" : "Straits Scientific (M) Sdn Bhd",
      "address" : "Straits Scientific (M) Sdn Bhd (148818-K) \n10-A, Jalan Nirwana 37, Taman Nirwana,68000 Ampang, Selangor, Malaysia",
      "productLine" : "Capillary Electrophoresis",
      "email" : "straits@3s.com.my",
      "phone" : "+603 03-9284 7170 / 9284 7173",
      "website" : "www.3s.com.my"
    } ]
  }, {
    "country" : "New Zealand",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Australia Pty Ltd \nPO BOX 514 Mt Waverley, Victoria, 3149 Australia \nMon-Fri: 9:00 AM-5:00 PM AET Fax: +61 3 9560 7924",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "anz.orders@sciex.com",
      "phone" : "+61 1300 62 7777",
      "website" : "www.sciex.com"
    } ]
  }, {
    "country" : "Pakistan",
    "companies" : [ {
      "name" : "Analytical Measuring Systems Private Limited",
      "address" : "AMS House, 14-C Lane # 04, Main Sehar Commercial Avenue, Khayaban-e-Sehar, DHA VII, Karachi.  75500  Pakistan.",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "amskhi@amspvtltd.com",
      "phone" : "(+92-21) 35345581",
      "website" : "https://amspvtltd.com/"
    } ]
  }, {
    "country" : "Philippines",
    "companies" : [ {
      "name" : "Dynalab Corp.",
      "address" : "Unit 905 Atlanta Centre, #31 Annapolis St., Greenhills San Juan City, Metro Manila, Philippines 1502",
      "productLine" : "Mass Spectrometry",
      "email" : "info@dynalab.com.ph",
      "phone" : "(632) 8 723-4710 / 8 727-6270",
      "website" : "http://dynalab.com.ph/"
    }, {
      "name" : "RainPhil Inc",
      "address" : "3/F Great Wall Building, 136 Yakal St., Makati City, Philippines",
      "productLine" : "Capillary Electrophoresis",
      "email" : "sales@rainphil.com",
      "phone" : "+632 8843-6352",
      "website" : "http://www.rainphil.com/home.html"
    } ]
  }, {
    "country" : "Singapore",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB SCIEX (Distribution) \n1 North Coast Avenue #06-01 Singapore 737663\nMon-Fri: 9:00 AM-6:00 PM",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sea.orders@sciex.com",
      "phone" : "+65 6559 4338 / Technical Support and Service Phone: +65 6559 4346",
      "website" : "https://sciex.com/request-support"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB SCIEX (Manufacturing) \n33 Marsiling Industrial Estate Road 3 #04-06 Singapore 739256",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sea.orders@sciex.com",
      "phone" : "+65 6586 1110",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "South Korea",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex Korea Limited Company \n15 Fl, Hibrand, 215, Yangjae 2-Dong Seocho-Gu, Seoul, South Korea \nFax: +82 2 2155 2150",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexkorea@sciex.com",
      "phone" : "+82 2 2155 4121",
      "website" : "www.sciex.com/kr"
    }, {
      "name" : "DKSH",
      "address" : "12F, 43 Digital-ro 34-gil, Guro-gu, Seoul, Republic of Korea",
      "productLine" : "Mass Spectrometry",
      "email" : "sangeok.bae@dksh.com",
      "phone" : "+82-2-6105-5662",
      "website" : "https://www.dksh.com/kr-en/home/contact-us"
    }, {
      "name" : "Korea Labs Co. Ltd.",
      "address" : "#201, 129 Unjung-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, 13461, Republic of Korea",
      "productLine" : "Mass Spectrometry",
      "email" : "order@korealabs.co.kr",
      "phone" : "+82-31-708-8229",
      "website" : "http://nmr.co.kr/"
    }, {
      "name" : "Korea TSTech",
      "address" : "#209, Suntek City, 513-15 Sangdaewon-dong, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
      "productLine" : "Capillary Electrophoresis",
      "email" : "tst5151@naver.com",
      "phone" : "+82-31-732-5388",
      "website" : ""
    }, {
      "name" : "LCK Technologies Co., Ltd.",
      "address" : "#1504, B-dong, 401 Yangcheon-ro Gangse-gu, Seoul, South Korea 07528",
      "productLine" : "Mass Spectrometry",
      "email" : "admin@lcktech.co.kr",
      "phone" : "+82-2-2631-2122",
      "website" : "https://www.lckorea.co.kr/"
    }, {
      "name" : "Ntwoskorea Co., Ltd.",
      "address" : "#226, Geumgwang High-Tech City, 789 Taejang-ro, Gimpo-si, Gyeonggi-do, Republic of Korea",
      "productLine" : "Capillary Electrophoresis",
      "email" : "n2skorea1@naver.com",
      "phone" : "+82-31-5177-8977",
      "website" : ""
    }, {
      "name" : "Yeongnam Science",
      "address" : "1st Fl, 11 Daebulseo-gil, Buk-gu, Daegu-si, South Korea",
      "productLine" : "Mass Spectrometry",
      "email" : "ynsi@hanmail.net",
      "phone" : "+82-53-951-6414",
      "website" : "www.sciex.com/kr"
    }, {
      "name" : "Young In Scientific Co., Ltd.",
      "address" : "Gu-Jung Bldg. 22 Apgujeong-ro 28 gil Gang Nam-Gu, Seoul, Replublic of Korea",
      "productLine" : "Mass Spectrometry",
      "email" : "cyh@youngin.com",
      "phone" : "+82-2-519-7300",
      "website" : ""
    } ]
  }, {
    "country" : "Taiwan",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex (Taiwan) Private Limited \n4F., No. 631, Ruiguang Rd., Neihu Dist., Taipei City, 11492, Taiwan\nMon-Fri: 9:00 AM-5:30 PM",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "service.taiwan@sciex.com",
      "phone" : "0800 818 978",
      "website" : "httsp://sciex.com/request-support"
    }, {
      "name" : "CL Technology Co., Ltd.",
      "address" : "No.13, Aly. 36, Ln. 88, Sec. 2, Guangfu Rd., Sanchong Dist., New Taipei City 241, Taiwan (R.O.C.)",
      "productLine" : "Mass Spectrometry",
      "email" : "sales@cl-technology.com.tw",
      "phone" : "+886 22278 1178",
      "website" : "hhttps://www.cl-technology.com.tw/"
    }, {
      "name" : "Genmall Biotechnology Co. Ltd.",
      "address" : "6F., No.145, Xinhu 1st Rd., Neihu Dist Taipei City Taipei 114 Taiwan",
      "productLine" : "Capillary Electrophoresis",
      "email" : "info@genmall.com.tw",
      "phone" : "TEL / (02)2796-0803　 FAX / (02)2796-0833",
      "website" : "https://www.genmall.com.tw"
    }, {
      "name" : "Kuang Cheng Biotech Service Company., Ltd",
      "address" : "20th Floor, No. 94, Section 1, Xintai 5th Road, Xizhi District, New Taipei City 221411, Taiwan",
      "productLine" : "Mass Spectrometry",
      "email" : "info@kcb.com.tw",
      "phone" : "+886 2 2696 1933",
      "website" : "httsp://sciex.com/request-support"
    } ]
  }, {
    "country" : "Thailand",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity:  Pall Corporation Filtration & Separations (Thailand) Ltd\n555, Rasa Tower 1, 16th Floor, Phahonyothin Rd., Chatuchak, Chatuchak, Bangkok, 10900 Thailand\nMon-Fri: 9:00 AM-5:30 PM\nPhone: +6621170374 SCIEXNow: 1800010311",
      "productLine" : "Mass Spectrometry",
      "email" : "sea.orders@sciex.com",
      "phone" : "+6621170374",
      "website" : "httsp://sciex.com/request-support"
    }, {
      "name" : "Bio-Active Co., Ltd",
      "address" : "Bio-Active Co., Ltd. \n188/1 Bio-Active Bldg., Soi Sirung, Chua Phloeng Rd., Chongnonsi, Yannawa Bangkok 10120 Thailand",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@bio-active.co.th",
      "phone" : "+66 2350 3090",
      "website" : "www.bio-active.co.th"
    }, {
      "name" : "MP MEDGROUP CO.,LTD",
      "address" : "MP MEDGROUP CO.,LTD \n12, Soi Nakniwat 12 Ladprow rd. 10230, Bangkok, Thailand",
      "productLine" : "Mass Spectrometry",
      "email" : "customerservice@mpgroup.co.th",
      "phone" : "+662 514 4112",
      "website" : "www.mpgroup.co.th"
    }, {
      "name" : "Saengvith Science Co., Ltd.",
      "address" : "Saengvith Science Co.,Ltd. \n123/4-5 Soi. Somdetphrapinklao 9, Somdetphrapinklao Road, Arun Amarin, Bangkoknoi",
      "productLine" : "Mass Spectrometry",
      "email" : "info@saengvithscience.co.th",
      "phone" : "+662 886-9200-7",
      "website" : "www.saengvithscience.co.th"
    } ]
  }, {
    "country" : "Vietnam",
    "companies" : [ {
      "name" : "Thang Long Chemicals and Instruments Joint Stock Company",
      "address" : "No. 8, Lane 263 Nguyen Trai, Thanh Xuan Trung Ward, Thanh Xuan District, City. Hanoi",
      "productLine" : "Mass Spectrometry",
      "email" : "sales@thanglonginst.com",
      "phone" : "+84 2437759619",
      "website" : "https://thanglonginst.com/"
    }, {
      "name" : "VIET NGUYEN TECHNOLOGY SERVICE TRADING CO., LTD",
      "address" : "211/10/1 Vĩnh Viễn, Phường 4, Quận 10, Hồ Chí Minh",
      "productLine" : "Mass Spectrometry and Capillary Electrophoresis",
      "email" : "hieu@vietnguyenco.vn",
      "phone" : "+84 028 66 570 570",
      "website" : "www.vietnguyenco.vn"
    } ]
  } ]
}, {
  "region" : "Latin America",
  "countries" : [ {
    "country" : "Argentina",
    "companies" : [ {
      "name" : "Bio Esanco SA",
      "address" : "Bio Esanco S.A. - Tacuarí 615 CABA (C1071AAM), Argentina - ventas@bioesanco.com.ar",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@bioesanco.com.ar",
      "phone" : "+54 11 5237 1111",
      "website" : "www.bioesanco.com.ar"
    } ]
  }, {
    "country" : "Bolivia",
    "companies" : [ {
      "name" : "RIDALINE SA",
      "address" : "Belastiqui 1537, 11400 Montevideo, Montevideo, Uruguay",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "ridaline@ridaline.com",
      "phone" : "(+ 598) 26144407",
      "website" : "www.ridaline.com.uy"
    } ]
  }, {
    "country" : "Brazil",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX - Alameda Araguaia, 3842, Alphaville Industrial | Barueri - SP, 06455-000, Brazil",
      "productLine" : "Mass Spectrometry and Capillary Electrophoresis",
      "email" : "suporte@sciex.com",
      "phone" : "+55 11 4040-3880",
      "website" : "https://sciex.com/br"
    } ]
  }, {
    "country" : "Chile",
    "companies" : [ {
      "name" : "Comercializadora Genesys Analitica Ltda",
      "address" : "Genesys Analitica COMERCIALIZADORA GENESYS ANALITICA LTDA. Av. Jose Domingo Cañas N°570, Ñuñoa Santiago, Chile",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "MVILLACURA@genesysanalitica.cl",
      "phone" : "+56 222094704",
      "website" : "www.genesysanalitica.cl"
    } ]
  }, {
    "country" : "Colombia",
    "companies" : [ {
      "name" : "CCV DE COLOMBIA SAS",
      "address" : "CCV de Colombia S.A.S - Carrera 45A # 93–77, Bogotá D.C., Colombia, NIT: 900873783 – 9, Código Postal: 111211",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@ccvgrupo.com, ventas@ccvgrupo.com, atencionalcliente@ccvgrupo.com",
      "phone" : "+ 57 601 7642216",
      "website" : "www.ccvgrupo.com.co"
    } ]
  }, {
    "country" : "Costa Rica",
    "companies" : [ {
      "name" : "Comercializadora Genesys Analitica Ltda",
      "address" : "Genesys Costa Rica SOCIEDAD ROJAS Y GUERRERO S.A. Barrio Dent, Avenida 5a, Edificio latitud Dent, oficina 314 ZIP 11501, San Jose, Costa Rica",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "ventas@genesyscostarica.com",
      "phone" : "+506 2253 8090",
      "website" : "www.genesyscostarica.com"
    } ]
  }, {
    "country" : "Ecuador",
    "companies" : [ {
      "name" : "INSTRUMENTECH CIA. LTDA.",
      "address" : "Instrumentech ltda INSTRUMENTECH CIA. LTDA. Calle Quilla Nan S47-98 y Calle S47E, Quita Pichincha 170701 Ecuador",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@instrumentech.com",
      "phone" : "+593 2297 5951",
      "website" : "www.instrumentech.com"
    } ]
  }, {
    "country" : "Mexico",
    "companies" : [ {
      "name" : "Distribuidora Rodval SA de CV",
      "address" : "Calzada Francisco I. Madero 1955, 64000 Monterrey, Nuevo León",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@distribuidorarodval.com",
      "phone" : "81-8347-0235",
      "website" : "https://distribuidorarodval.com"
    }, {
      "name" : "Inolab Especialistas de Servicio",
      "address" : "Inolab Especialistas en Servicio SA de CV (Inolab) Aniceto Ortega 1341 Col. Del Valle Mexico City 31000 Mexico For CE Service: atencionclientes@inolab.com Fax: +52 55 55349135",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "ventas@inolab.com",
      "phone" : "+52 55 55242429",
      "website" : "www.inolab.com"
    }, {
      "name" : "Logística y Tecnologías para Laboratorios",
      "address" : "Logistica y Tecnologias para Laboratorio SA de CV (Logitlab) Av. Santos Degollado #331 Col. Primero de Diciembre Mexicali Baja California 21260 Mexico Dial-free phone: 01 800 732 0683 Fax: + 52 686 555 5833 http://logitlab.com/lg/",
      "productLine" : "Mass Spectrometry",
      "email" : "raquel.pedrin@logitlab.com.mx",
      "phone" : "+52 686 553 5833",
      "website" : "http://www.logitlab.com.mx/"
    }, {
      "name" : "SCIEX",
      "address" : "Av. Insurgentes Sur 1458 Floor 19, , Col. Actipan, Del. Benito Juárez, Mexico City, 03230",
      "productLine" : "Mass Spectrometry and Capillary Electrophoresis",
      "email" : "latam@sciex.com",
      "phone" : "+52 55 4166 6300",
      "website" : "sciex.com/mx"
    } ]
  }, {
    "country" : "Paraguay",
    "companies" : [ {
      "name" : "Fisc Group",
      "address" : "Cnel. Ramón Diaz N° 564, Asunción, Paraguay",
      "productLine" : "Capillary Electrophoresis and Mass Spectrometry",
      "email" : "info@fisc.com.py",
      "phone" : "+595213288533",
      "website" : "fisc.com.py"
    } ]
  }, {
    "country" : "Peru",
    "companies" : [ {
      "name" : "SUMINISTROS DE LABORATORIO S.A.",
      "address" : "SULABSA SUMINISTROS DE LABORATORIO S.A. Av. Javier Prado Este 6210 Of 206 Lima12, Peru",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sulabsa@sulabsa.com",
      "phone" : "+51 1555 4368 / 6462",
      "website" : "www.sulabsa.com"
    } ]
  }, {
    "country" : "Uruguay",
    "companies" : [ {
      "name" : "Bio Esanco SA",
      "address" : "Bio Esanco S.A. - Tacuarí 615 CABA (C1071AAM), Argentina - ventas@bioesanco.com.ar",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "info@bioesanco.com.ar",
      "phone" : "+54 11 5237 1111",
      "website" : "www.bioesanco.com.ar"
    }, {
      "name" : "RIDALINE SA",
      "address" : "Belastiqui 1537, 11400 Montevideo, Montevideo, Uruguay",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "ridaline@ridaline.com",
      "phone" : "(+ 598) 26144407",
      "website" : "www.ridaline.com.uy"
    } ]
  } ]
}, {
  "region" : "North America",
  "countries" : [ {
    "country" : "Canada",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Legal Entity: AB Sciex LP 71 Four Valley Drive Concord, Ontario, L4K 4V8, Canada",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+1 877 740 2129",
      "website" : "https://sciex.com/request-support"
    } ]
  }, {
    "country" : "United States",
    "companies" : [ {
      "name" : "SCIEX",
      "address" : "SCIEX Sales and Service 1201 Radio Road Redwood City, CA 94065 U.S.A. Fax: +1 800 343 1346",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+1 877 740 2129",
      "website" : "https://sciex.com/request-support"
    }, {
      "name" : "SCIEX",
      "address" : "SCIEX Headquarters Legal Entity: AB Sciex LLC 250 Forest Street Marlborough, MA 01752 U.S.A. Fax: +1 800 343 1346",
      "productLine" : "Mass Spectrometry & Capillary Electrophoresis",
      "email" : "sciexnow@sciex.com",
      "phone" : "+1 877 740 2129",
      "website" : "https://sciex.com/request-support"
    } ]
  } ]
} ]

  /* ==========================================================
     2️⃣ BUILD UI
  ========================================================== */

  block.innerHTML = `
    <div class="contact-wrapper">
      <h2 class="contact-title">${headingText}</h2>

      <input type="text" placeholder="Search by country" class="search-input" id="search-input"/>

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

  const trigger = wrapper.querySelector(".select-trigger");
  const optionsContainer = wrapper.querySelector(".options");

 

  // Reset options
  optionsContainer.innerHTML = "";

  items.forEach((item, index) => {

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

  // Toggle dropdown open/close
  trigger.onclick = () => {

    document.querySelectorAll(".custom-select").forEach((el) => {
      if (el !== wrapper) {
        el.classList.remove("open");
      }
    });

    wrapper.classList.toggle("open");
  };
}

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  document.querySelectorAll(".custom-select").forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
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
                <h3 class="company-name">${company.name ?? ""}</h3>
                <p class="product-line">${company.productLine ?? ""}</p>
                <p class="address">${company.address ?? ""}</p>
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