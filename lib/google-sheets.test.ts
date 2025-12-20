import { describe, it, expect } from 'vitest';
import { fetchEmployees, submitExpense } from './google-sheets';

describe('Google Sheets Integration', () => {
  it('should fetch employees from Google Sheets', async () => {
    const employees = await fetchEmployees();
    
    // Should return an array
    expect(Array.isArray(employees)).toBe(true);
    
    // Should have at least one employee
    expect(employees.length).toBeGreaterThan(0);
    
    // First employee should have required fields
    const firstEmployee = employees[0];
    expect(firstEmployee).toHaveProperty('name');
    expect(firstEmployee).toHaveProperty('email');
    expect(firstEmployee).toHaveProperty('team');
    expect(firstEmployee).toHaveProperty('role');
    
    console.log('✓ Successfully fetched', employees.length, 'employees');
    console.log('✓ Sample employee:', firstEmployee.name, '-', firstEmployee.email);
  }, 10000); // 10 second timeout for API call

  it('should submit expense to Google Apps Script', async () => {
    const testExpense = {
      employeeName: 'Test User',
      employeeEmail: 'test@phoenixdm.co',
      team: 'Test Team',
      category: 'Test Category',
      amount: 10.00,
      paymentMethod: 'Test Card',
      notes: 'Vitest validation test',
    };
    
    const result = await submitExpense(testExpense);
    
    // Should return success
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('message');
    
    console.log('✓ Successfully submitted test expense');
    console.log('✓ Response:', result.message);
  }, 10000); // 10 second timeout for API call
});
