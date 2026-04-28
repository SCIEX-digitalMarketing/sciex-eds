// api to get the enrollment and cost info of the course
export default async function getCourseCatalogData(email,courseId) {
  try {
    const endpoint = `/bin/sciex-eds/enrollement?email=${email}&course=${courseId}`;
    console.log('Fetching partners data from:', endpoint);
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

// export default  async function getCourseCatalogData(email, courseId) {
//     console.log('Mock getCourseCatalogData called with:', { email, courseId });
//     return {
//       enrolment: [
//         {
//           seatsRemaining: 6,
//           LMSSession: {
//             Id: "a5I3w000001e1XzEAI",
//             Name: "Framingham",
//             LMS_Session_ID__c: "544d3363-67e9-4954-b619-2056f0673946",
//             Start_Date__c: "2029-04-04T16:00:00.000+0000",
//             End_Date__c: "2029-04-04T17:00:00.000+0000",
//             Class_Room_Size__c: 6,
//             Course_Language__c: "English",
//             LMS_Schedule__r: {
//               records: [
//                 {
//                   Venue_Name__c: "Indianapolis, Indiana, US"
//                 }
//               ]
//             }
//           }
//         },
//         {
//           seatsRemaining: 1,
//           LMSSession: {
//             Id: "a5I3w000001e1Y0EAI",
//             Name: "India training",
//             LMS_Session_ID__c: "3e417d69-f2c9-4175-86b2-ceef10a75078",
//             Start_Date__c: "2030-04-05T16:00:00.000+0000",
//             End_Date__c: "2030-04-05T17:00:00.000+0000",
//             Class_Room_Size__c: 1,
//             Course_Language__c: "English",
//             LMS_Schedule__r: {
//               records: [
//                 {
//                   Venue_Name__c: "Gurgaon, India"
//                 }
//               ]
//             }
//           }
//         }
//       ],
//       cost: {
//         PriceBookEntry: {
//           Id: "01u3w00000CZeP1AAL",
//           Name: "4 Day Introduction to Triple Quad Virtual",
//           ProductCode: "TRNVT115",
//           UnitPrice: 4011,
//           CurrencyIsoCode: "USD"
//         },
//         defaultPriceBookUsed: false,
//         countryName: "US"
//       },
//       buyNow: "https://sciex--full.sandbox.my.salesforce.com",
//       Enrollment_URL: "/services/apexrest/enrollment"
//     }; 
// }