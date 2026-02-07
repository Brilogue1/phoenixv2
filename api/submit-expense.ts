/**
 * Vercel Serverless Function - Expense Proxy
 * This proxies requests to Google Apps Script to avoid CORS issues
 * 
 * File location: api/submit-expense.ts
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Get the Apps Script URL from environment
    const scriptUrl = process.env.EXPO_PUBLIC_EXPENSE_SCRIPT_URL;
    if (!scriptUrl) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Apps Script URL not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the request body
    const body = await request.json();

    // Forward the request to Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow'
    });

    const result = await response.json();

    // Return the response with CORS headers
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit expense'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
