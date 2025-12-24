const SHEET_ID = process.env.EXPO_PUBLIC_GOOGLE_SHEET_ID || '1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI';

/**
 * Parse Google Sheets date format Date(2025,11,19) to "12/19"
 */
function parseGoogleDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  
  // Check if it's already in MM/DD format
  if (dateStr.match(/^\d{1,2}\/\d{1,2}$/)) {
    return dateStr;
  }
  
  // Parse Date(YYYY,M,D) format
  const match = dateStr.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (match) {
    const month = parseInt(match[2]) + 1; // Month is 0-indexed
    const day = parseInt(match[3]);
    return `${month}/${day}`;
  }
  
  return dateStr;
}

export interface Employee {
  name: string;
  email: string;
  team: string;
  role: string;
  title: string;
  phone: string;
  repAirportCode: string;
}

export interface Flight {
  repName: string;
  repEmail: string;
  repAirportCode: string;
  // Week 1 (Columns D-G)
  week1FlyDate: string;
  week1Confirmation: string;
  week1ArrivalDeparture: string;
  week1CostOfFlight: string;
  // Week 2 (Columns H-L)
  week2FlyDate: string;
  week2Confirmation: string;
  week2ArrivalDeparture: string;
  week2CostOfFlight: string;
  // Week 3 (Columns M-Q)
  week3FlyDate: string;
  week3Confirmation: string;
  week3ArrivalDeparture: string;
  week3CostOfFlight: string;
}

export interface RentalCar {
  repName: string;
  repEmail: string;
  // Week 1 (Columns C-G)
  week1Date: string;
  week1RentalCarInfo: string;
  week1Vendor: string;
  week1Confirmation: string;
  week1PickupReturn: string;
  // Week 2 (Columns H-L)
  week2Date: string;
  week2RentalCarInfo: string;
  week2Vendor: string;
  week2Confirmation: string;
  week2PickupReturn: string;
  // Week 3 (Columns M-Q)
  week3Date: string;
  week3RentalCarInfo: string;
  week3Vendor: string;
  week3Confirmation: string;
  week3PickupReturn: string;
}

export interface HotelInfo {
  team: string;
  // Week 1 (Columns B-H)
  week1Date: string;
  week1Reservation: string;
  week1HotelName: string;
  week1Address: string;
  week1Food: string;
  week1ConferenceConfirmation: string;
  week1ConferenceAddress: string;
  // Week 2 (Columns I-O)
  week2Date: string;
  week2Reservation: string;
  week2HotelName: string;
  week2Address: string;
  week2Food: string;
  week2ConferenceConfirmation: string;
  week2ConferenceAddress: string;
  // Week 3 (Columns P-V)
  week3Date: string;
  week3Reservation: string;
  week3HotelName: string;
  week3Address: string;
  week3Food: string;
  week3ConferenceConfirmation: string;
  week3ConferenceAddress: string;
}

/**
 * Fetch data from Google Sheets public API
 */
async function fetchSheet(sheetName: string) {
  // Add timestamp to bust cache and always get fresh data
  const timestamp = Date.now();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&_=${timestamp}`;
  
  console.log(`[fetchSheet] Fetching sheet: ${sheetName}`);
  
  const response = await fetch(url, {
    cache: 'no-store', // Prevent browser caching
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const text = await response.text();
  // Remove the callback wrapper
  const json = JSON.parse(text.substring(47).slice(0, -2));
  
  const rows = json.table.rows.map((row: any) => row.c.map((cell: any) => cell?.v || ''));
  
  console.log(`[fetchSheet] ${sheetName} returned ${rows.length} total rows (including header)`);
  
  return rows;
}

/**
 * Fetch employees from the Logins sheet
 */
export async function fetchEmployees(): Promise<Employee[]> {
  const rows = await fetchSheet('Logins');
  
  console.log(`[fetchEmployees] Total rows from sheet (including header): ${rows.length}`);
  console.log(`[fetchEmployees] First row (header):`, rows[0]);
  
  const allEmployees = rows.slice(1).map((row: string[], index: number) => {
    const emp = {
      name: row[0] || '',        // Column A: Name
      email: row[1] || '',       // Column B: Email
      // row[2] is Password - we don't need it
      title: row[3] || '',       // Column D: Title (also used as role)
      team: row[4] || '',        // Column E: Team
      role: row[3] || '',        // Column D: Title (using as role)
      phone: '',                 // Not in this sheet
      repAirportCode: '',        // Not in this sheet
    };
    
    const rowNumber = index + 2; // +2 because: +1 for 0-based index, +1 for header row
    
    // Log each row for debugging
    if (!emp.name && !emp.email) {
      console.log(`[fetchEmployees] Row ${rowNumber} is COMPLETELY EMPTY (will be filtered)`);
    } else if (!emp.email) {
      console.warn(`[fetchEmployees] Row ${rowNumber} missing EMAIL: Name="${emp.name}", Team="${emp.team}"`);
    } else if (!emp.name) {
      console.warn(`[fetchEmployees] Row ${rowNumber} missing NAME: Email="${emp.email}"`);
    } else {
      console.log(`[fetchEmployees] Row ${rowNumber} OK: ${emp.name} (${emp.email})`);
    }
    
    return emp;
  });
  
  // Only filter out completely empty rows
  const employees = allEmployees.filter((emp: Employee) => emp.name || emp.email);
  
  console.log(`[fetchEmployees] ✅ Returning ${employees.length} employees (filtered out ${allEmployees.length - employees.length} completely empty rows)`);
  console.log(`[fetchEmployees] Employee list:`, employees.map(e => e.name || e.email));
  
  return employees;
}

/**
 * Fetch flights from the Flights sheet
 * Columns: A=Name, B=Email, C=Airport, D=W1Date, E=W1Conf, F=W1ArrDep, G=W1Cost,
 *          H=W2Date, I=W2Airport, J=W2Conf, K=W2ArrDep, L=W2Cost,
 *          M=W3Date, N=W3Airport, O=W3Conf, P=W3ArrDep, Q=W3Cost
 */
export async function fetchFlights(): Promise<Flight[]> {
  const rows = await fetchSheet('Flights');
  return rows.slice(1).map((row: string[]) => ({
    repName: row[0] || '',
    repEmail: row[1] || '',
    repAirportCode: row[2] || '',
    // Week 1: D, E, F, G (indices 3, 4, 5, 6)
    week1FlyDate: parseGoogleDate(row[3]),
    week1Confirmation: row[4] || '',
    week1ArrivalDeparture: row[5] || '',
    week1CostOfFlight: row[6] || '',
    // Week 2: H, J, K, L (indices 7, 9, 10, 11) - Note: I is airport (8)
    week2FlyDate: parseGoogleDate(row[7]),
    week2Confirmation: row[9] || '',
    week2ArrivalDeparture: row[10] || '',
    week2CostOfFlight: row[11] || '',
    // Week 3: M, O, P, Q (indices 12, 14, 15, 16) - Note: N is airport (13)
    week3FlyDate: parseGoogleDate(row[12]),
    week3Confirmation: row[14] || '',
    week3ArrivalDeparture: row[15] || '',
    week3CostOfFlight: row[16] || '',
  }));
}

/**
 * Fetch rental cars from the Rental Cars sheet
 * Columns: A=Name, B=Email, C=W1Date, D=W1Info, E=W1Vendor, F=W1Conf, G=W1Pickup,
 *          H=W2Date, I=W2Info, J=W2Vendor, K=W2Conf, L=W2Pickup,
 *          M=W3Date, N=W3Info, O=W3Vendor, P=W3Conf, Q=W3Pickup
 */
export async function fetchRentalCars(): Promise<RentalCar[]> {
  const rows = await fetchSheet('Rental Cars');
  return rows.slice(1).map((row: string[]) => ({
    repName: row[0] || '',
    repEmail: row[1] || '',
    // Week 1: C, D, E, F, G (indices 2, 3, 4, 5, 6)
    week1Date: parseGoogleDate(row[2]),
    week1RentalCarInfo: row[3] || '',
    week1Vendor: row[4] || '',
    week1Confirmation: row[5] || '',
    week1PickupReturn: row[6] || '',
    // Week 2: H, I, J, K, L (indices 7, 8, 9, 10, 11)
    week2Date: parseGoogleDate(row[7]),
    week2RentalCarInfo: row[8] || '',
    week2Vendor: row[9] || '',
    week2Confirmation: row[10] || '',
    week2PickupReturn: row[11] || '',
    // Week 3: M, N, O, P, Q (indices 12, 13, 14, 15, 16)
    week3Date: parseGoogleDate(row[12]),
    week3RentalCarInfo: row[13] || '',
    week3Vendor: row[14] || '',
    week3Confirmation: row[15] || '',
    week3PickupReturn: row[16] || '',
  }));
}

/**
 * Fetch hotel info from the Hotel Info sheet
 * Columns: A=Team, B=W1Date, C=W1Res, D=W1Name, E=W1Addr, F=W1Food, G=W1ConfConf, H=W1ConfAddr,
 *          I=W2Date, J=W2Res, K=W2Name, L=W2Addr, M=W2Food, N=W2ConfConf, O=W2ConfAddr,
 *          P=W3Date, Q=W3Res, R=W3Name, S=W3Addr, T=W3Food, U=W3ConfConf, V=W3ConfAddr
 */
export async function fetchHotelInfo(): Promise<HotelInfo[]> {
  const rows = await fetchSheet('Hotel Info');
  return rows.slice(1).map((row: string[]) => ({
    team: row[0] || '',
    // Week 1: B, C, D, E, F, G, H (indices 1-7)
    week1Date: parseGoogleDate(row[1]),
    week1Reservation: row[2] || '',
    week1HotelName: row[3] || '',
    week1Address: row[4] || '',
    week1Food: row[5] || '',
    week1ConferenceConfirmation: row[6] || '',
    week1ConferenceAddress: row[7] || '',
    // Week 2: I, J, K, L, M, N, O (indices 8-14)
    week2Date: parseGoogleDate(row[8]),
    week2Reservation: row[9] || '',
    week2HotelName: row[10] || '',
    week2Address: row[11] || '',
    week2Food: row[12] || '',
    week2ConferenceConfirmation: row[13] || '',
    week2ConferenceAddress: row[14] || '',
    // Week 3: P, Q, R, S, T, U, V (indices 15-21)
    week3Date: parseGoogleDate(row[15]),
    week3Reservation: row[16] || '',
    week3HotelName: row[17] || '',
    week3Address: row[18] || '',
    week3Food: row[19] || '',
    week3ConferenceConfirmation: row[20] || '',
    week3ConferenceAddress: row[21] || '',
  }));
}

/**
 * Submit expense to Google Sheets via Apps Script
 */
export async function submitExpense(expense: {
  employeeName: string;
  employeeEmail: string;
  team: string;
  date?: string;
  category: string;
  amount: number;
  paymentMethod?: string;
  notes?: string;
  description?: string;
  receiptUrl?: string;
  receiptImageUri?: string;
}) {
  const url = process.env.EXPO_PUBLIC_EXPENSE_API_URL;
  if (!url) {
    throw new Error('Expense API URL not configured');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to submit expense: ${response.statusText}`);
  }

  return await response.json();
}

export interface SaleTransaction {
  date: string;
  team: string;
  repName: string;
  repEmail: string;
  client: string;
  salePrice: string;
  collected: string;
  merchant: string;
  exitCost: string;
  net: string;
  percentage: string;
  commission: string;
  notes: string;
}

/**
 * Fetch sales from the Sales sheet
 * Columns: A=Date, B=Team, C=Rep Name, D=Rep Email, E=Client, F=Sale Price, 
 *          G=Collected, H=Merchant 4.95%, I=Exit Cost, J=Net, K=Percentage, 
 *          L=Commission, M=Notes
 */
export async function fetchSales(): Promise<SaleTransaction[]> {
  const rows = await fetchSheet('Sales');
  return rows.slice(1).map((row: string[]) => ({
    date: row[0] || '',
    team: row[1] || '',
    repName: row[2] || '',
    repEmail: row[3] || '',
    client: row[4] || '',
    salePrice: row[5] || '',
    collected: row[6] || '',
    merchant: row[7] || '',
    exitCost: row[8] || '',
    net: row[9] || '',
    percentage: row[10] || '',
    commission: row[11] || '',
    notes: row[12] || '',
  })).filter((sale: SaleTransaction) => sale.repName && sale.commission); // Filter out empty rows
}


export interface Update {
  id: string;
  message: string;
  target: string; // "All", team name like "KYT2", or specific email
  date: string;
  startDate?: string; // Optional: MM/DD/YYYY format
  endDate?: string;   // Optional: MM/DD/YYYY format
}

/**
 * Fetch updates from the Updates sheet
 * Columns: A=ID, B=Message, C=Target, D=StartDate, E=EndDate
 */
export async function fetchUpdates(): Promise<Update[]> {
  try {
    const rows = await fetchSheet('Updates');
    
    const updates = rows.slice(1).map((row: string[], index: number) => ({
      id: row[0] || `update-${index}`,
      message: row[1] || '',
      target: row[2] || 'All',
      date: row[3] || '', // Keep for backwards compatibility (startDate)
      startDate: row[3] || undefined, // Column D: Start date
      endDate: row[4] || undefined,   // Column E: End date
    })).filter((update: Update) => update.message); // Filter out empty rows
    
    console.log('[fetchUpdates] Loaded updates with dates:', updates);
    
    return updates;
  } catch (error) {
    console.error('[fetchUpdates] Error:', error);
    throw error;
  }
}
