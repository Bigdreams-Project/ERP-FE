// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Payment Receipt</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

//         body {
//             font-family: 'Inter', sans-serif;
//             background-color: #f3f4f6;
//         }

//         .receipt-container {
//             max-width: 800px;
//             margin: 0 auto;
//             padding: 2rem;
//         }
//     </style>
// </head>

// <body class="bg-gray-100 min-h-screen">

//     <!-- Top Header Bar -->
//     <header class="bg-[#121422] text-white py-4 px-8 flex justify-between items-center shadow-lg">
//         <div class="flex items-center space-x-2">
//             <!-- Tecterminal Logo SVG -->
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <rect x="2" y="2" width="20" height="20" rx="4" fill="#6366F1" />
//                 <path d="M7 7L17 17M17 7L7 17" stroke="white" stroke-width="2" stroke-linecap="round"
//                     stroke-linejoin="round" />
//             </svg>
//             <span class="font-bold text-xl">Tecterminal</span>
//         </div>
//         <div class="flex-1 ml-4 flex flex-col">
//             <span class="text-sm text-gray-400">Content-Driven Education</span>
//         </div>
//         <div class="flex items-center space-x-4">
//             <button class="flex items-center space-x-2 px-4 py-2 border border-white/50 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
//                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.94V10a2 2 0 0 0-2-2L4.5 14.5m10-10.94L12 8a2 2 0 0 1 2 2v10.94m4-18a2 2 0 1 0-2 2h2a2 2 0 1 0-2-2"/></svg>
//                 <span>Edit T&C</span>
//             </button>
//             <button id="printButton" class="flex items-center space-x-2 px-4 py-2 border border-white/50 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
//                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12M18 14V9" /></svg>
//                 <span>Print Receipt</span>
//             </button>
//             <button class="flex items-center space-x-2 px-4 py-2 border border-white/50 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
//                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a2.5 2.5 0 0 0-5-5m-14 5a2.5 2.5 0 0 0 5 5M12 2v20M5 19l2.75-2.75M19 19l-2.75-2.75M5 5l2.75 2.75M19 5l-2.75 2.75"/></svg>
//                 <span>Send via WhatsApp</span>
//             </button>
//         </div>
//     </header>

//     <main class="receipt-container">
//         <!-- Main Content Card -->
//         <div class="bg-white p-8 rounded-lg shadow-xl">

//             <!-- Title -->
//             <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Payment Receipt</h1>

//             <!-- Student & Payment Details Section -->
//             <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                 <h2 class="text-xl font-bold text-gray-800 mb-4">Student & Payment Details</h2>
//                 <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-700">
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Student Name</span>
//                         <span class="font-semibold">Alice Wonderland</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Student ID</span>
//                         <span class="font-semibold">CPN/AB/2023-007</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Course</span>
//                         <span class="font-semibold">Advanced Web Development</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Batch</span>
//                         <span class="font-semibold">Spring 2024 (WE-2401)</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Amount Paid</span>
//                         <span class="font-semibold">NGN 2,500,000.00</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Payment Type</span>
//                         <span class="font-semibold">Course Fee</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Date Paid</span>
//                         <span class="font-semibold">October 26, 2024</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Transaction ID</span>
//                         <span class="font-semibold">TRX-9876543210</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Payment Method</span>
//                         <span class="font-semibold">Bank Transfer</span>
//                     </div>
//                     <div class="flex flex-col">
//                         <span class="text-gray-500">Recorded By</span>
//                         <span class="font-semibold">Annabelle Uche</span>
//                     </div>
//                 </div>
//             </div>

//             <!-- Terms & Conditions Section -->
//             <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
//                 <h2 class="text-xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>
//                 <p class="text-sm text-gray-600 mb-4">
//                     This receipt confirms your payment for the specified course. Please retain for your records.
//                 </p>

//                 <div class="space-y-6">
//                     <div>
//                         <h3 class="font-semibold text-gray-800">Refund Policy</h3>
//                         <p class="text-sm text-gray-600">
//                             All course fees are non-refundable after 7 days from the payment date. A 50% refund is available if cancellation occurs within 7 days, provided no more than 10% of the course content has been accessed. Administrative fees may apply.
//                         </p>
//                     </div>
//                     <div>
//                         <h3 class="font-semibold text-gray-800">Payment Restrictions</h3>
//                         <p class="text-sm text-gray-600">
//                             Payments are accepted via credit card, bank transfer, or approved digital wallets. Partial payments are only accepted under a pre-approved installment plan. Late payments may incur additional charges.
//                         </p>
//                     </div>
//                     <div>
//                         <h3 class="font-semibold text-gray-800">Late Fees</h3>
//                         <p class="text-sm text-gray-600">
//                             A late fee of 5% of the outstanding balance will be applied for payments not received within 3 days past the due date. Continued non-payment may result in suspension from class and course access.
//                         </p>
//                     </div>
//                     <div>
//                         <h3 class="font-semibold text-gray-800">Course Enrollment</h3>
//                         <p class="text-sm text-gray-600">
//                             Enrollment is only confirmed upon full payment or establishment of an approved payment plan. Access to course materials will be granted immediately after payment confirmation.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </main>

//     <!-- Footer -->
//     <footer class="text-center text-xs text-gray-500 mt-4 pb-4">
//         Made with V
//     </footer>

//     <script>
//         document.getElementById('printButton').addEventListener('click', () => {
//             window.print();
//         });
//     </script>
// </body>

// </html>
