/**
 * Create card 
 */
function createCardElement(item) {
  return `
      <li class="card">
          <img src="${item.url}" alt="NASA Photo of the Day">
          <div class="card-content">
              <p class="subheader">
                  ${item.date} // 
              </p>
              <h3 class="header">
                  ${item.title}
              </h3>
              <p>${item.explanation}</p>
          </div>
      </li>
    `;
}

/**
 * Create multiple cards
 */
function createCardElements(data) {
  return data.map(createCardElement).join("");
}

/**
 * Fetch Astronomy Photo of the Day
 */
async function fetchAndDisplayAPODs() {
  const apiKey = '1t1z9mKYxgafOVJjT4Rd9WZeH5hDTFCFGMmxbZYP'; 
  const url = new URL('https://api.nasa.gov/planetary/apod');
  const params = {
      api_key: apiKey,
      count: 4
  };


Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

try {
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error(`Failed to retrieve data: ${response.status}`);
  }
  const data = await response.json(); // Convert the response body to JSON

  
  const cardsHTML = createCardElements(data);
  document.getElementById("option-1-results").innerHTML = cardsHTML;
} catch (error) {
  console.error('Error:', error);
}
}
document.addEventListener('DOMContentLoaded', fetchAndDisplayAPODs);
document.getElementById('submit-button').addEventListener('click', fetchAndDisplayAPODs); // Fetch and display new APODs when the button is clicked

function populateDateDropdowns() {
  const yearDropdown = document.getElementById('year-dropdown');

  // Add default option
  yearDropdown.add(new Option('Year', ''));

  // Populate year options
  const currentYear = new Date().getFullYear();
  for (let year = 1995; year <= currentYear; year++) {
      yearDropdown.add(new Option(year, year));
  }


  updateMonthDropdown();
}

function updateMonthDropdown() {
  const year = document.getElementById('year-dropdown').value;
  const monthDropdown = document.getElementById('month-dropdown');
  monthDropdown.innerHTML = ''; 
  monthDropdown.add(new Option('Month', '')); 

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let startMonth = 0; // Start from January
  if (year === '1995') {
      startMonth = 5; // Start from June for 1995
  }

  for (let i = startMonth; i < months.length; i++) {
      monthDropdown.add(new Option(months[i], i + 1));
  }

  updateDayDropdown(); // Change day based on month (and year for case of febuary)
}

function updateDayDropdown() {
  const year = document.getElementById('year-dropdown').value;
  const month = document.getElementById('month-dropdown').value;
  const dayDropdown = document.getElementById('day-dropdown');

  dayDropdown.innerHTML = '';
  dayDropdown.add(new Option('Day', '')); // Add default option

  if (!year || !month) return; // reset day if year or month is not selected

  let startDay = 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  // Special case for June 1995
  if (year === '1995' && month === '6') {
      startDay = 20;
  }

  for (let day = startDay; day <= daysInMonth; day++) {
      dayDropdown.add(new Option(day, day));
  }
}


// Fetch and display APOD for the selected date
async function fetchAndDisplayAPODForDate() {
  const year = document.getElementById('year-dropdown').value;
  const month = document.getElementById('month-dropdown').value;
  const day = document.getElementById('day-dropdown').value;

  const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  const apiKey = '1t1z9mKYxgafOVJjT4Rd9WZeH5hDTFCFGMmxbZYP';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to retrieve data: ${response.status}`);
      }
      const data = await response.json();

      const cardHTML = createCardElement({
          url: data.url,
          date: data.date,
          title: data.title,
          explanation: data.explanation
      });
      document.getElementById("option-2-results").innerHTML = cardHTML;
  } catch (error) {
      console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateDateDropdowns();
  document.getElementById('year-dropdown').addEventListener('change', () => {
      updateMonthDropdown();
      updateDayDropdown();
  });
  document.getElementById('month-dropdown').addEventListener('change', updateDayDropdown);
  document.getElementById('select-date-button').addEventListener('click', fetchAndDisplayAPODForDate);
});

function populateRangeDateDropdowns(prefix) {
  const yearDropdown = document.getElementById(`${prefix}-year-dropdown`);
  yearDropdown.innerHTML = '';
  yearDropdown.add(new Option('Year', ''));

  const currentYear = new Date().getFullYear();
  for (let year = 1995; year <= currentYear; year++) {
      yearDropdown.add(new Option(year, year));
  }

  const monthDropdown = document.getElementById(`${prefix}-month-dropdown`);
  monthDropdown.innerHTML = ''; 
  monthDropdown.add(new Option('Month', ''));

  updateRangeMonthDropdown(prefix); // get months based on the year
}

function updateRangeMonthDropdown(prefix) {
  const year = document.getElementById(`${prefix}-year-dropdown`).value;
  const monthDropdown = document.getElementById(`${prefix}-month-dropdown`);
  monthDropdown.innerHTML = ''; 
  monthDropdown.add(new Option('Month', ''));

  let startMonth = 0;
  if (year === '1995') {
      startMonth = 5; // Start from June for 1995
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  for (let i = startMonth; i < months.length; i++) {
      monthDropdown.add(new Option(months[i], i + 1));
  }

  updateRangeDayDropdown(prefix); // select days considering the month
}

function updateRangeDayDropdown(prefix) {
  const year = document.getElementById(`${prefix}-year-dropdown`).value;
  const month = document.getElementById(`${prefix}-month-dropdown`).value;
  const dayDropdown = document.getElementById(`${prefix}-day-dropdown`);
  dayDropdown.innerHTML = ''; 
  dayDropdown.add(new Option('Day', ''));

  if (!year || !month) return;

  let startDay = 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  if (year === '1995' && month === '6') {
      startDay = 20; // Special case for June 1995
  }

  for (let day = startDay; day <= daysInMonth; day++) {
      dayDropdown.add(new Option(day, day));
  }
}

async function fetchAndDisplayAPODsInRange() {
  const startYear = document.getElementById('start-year-dropdown').value;
  const startMonth = document.getElementById('start-month-dropdown').value;
  const startDay = document.getElementById('start-day-dropdown').value;
  const endYear = document.getElementById('end-year-dropdown').value;
  const endMonth = document.getElementById('end-month-dropdown').value;
  const endDay = document.getElementById('end-day-dropdown').value;

  const startDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
  const endDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;

  const apiKey = '1t1z9mKYxgafOVJjT4Rd9WZeH5hDTFCFGMmxbZYP';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to retrieve data: ${response.status}`);
      }
      const data = await response.json();

      const cardsHTML = createCardElements(data); // Use cards to display output
      document.getElementById("option-2-enhanced-results").innerHTML = cardsHTML;
  } catch (error) {
      console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateDateDropdowns(); // For the single date selector in Option 2
  populateRangeDateDropdowns('start'); // For the start date selector in Option 2 Enhanced
  populateRangeDateDropdowns('end'); // For the end date selector in Option 2 Enhanced

  // Setup event listeners for Option 2
  document.getElementById('year-dropdown').addEventListener('change', () => {
      updateMonthDropdown();
      updateDayDropdown();
  });
  document.getElementById('month-dropdown').addEventListener('change', updateDayDropdown);
  document.getElementById('select-date-button').addEventListener('click', fetchAndDisplayAPODForDate);
  document.getElementById('start-year-dropdown').addEventListener('change', () => {
    updateRangeMonthDropdown('start');
    updateRangeDayDropdown('start');
});
document.getElementById('start-month-dropdown').addEventListener('change', () => updateRangeDayDropdown('start'));
document.getElementById('start-day-dropdown').addEventListener('change', updateRangeDayDropdown);

document.getElementById('end-year-dropdown').addEventListener('change', () => {
    updateRangeMonthDropdown('end');
    updateRangeDayDropdown('end');
});
document.getElementById('end-month-dropdown').addEventListener('change', () => updateRangeDayDropdown('end'));
document.getElementById('end-day-dropdown').addEventListener('change', updateRangeDayDropdown);

document.getElementById('select-range-button').addEventListener('click', fetchAndDisplayAPODsInRange);
});