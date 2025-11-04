import { Quote } from '../types';

// IMPORTANT: Replace with your free API key from https://finnhub.io
const FINNHUB_API_KEY = 'YOUR_FINNHUB_API_KEY'; 

const BASE_URL = 'https://finnhub.io/api/v1';

interface FetchResult {
    data: Quote | null;
    error: string | null;
}

export const fetchStockQuote = async (symbol: string): Promise<FetchResult> => {
    if (FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY' || !FINNHUB_API_KEY) {
        return { data: null, error: 'مفتاح API غير معين' };
    }
    
    // Assume Egyptian stocks from the predefined list need a ".CA" suffix for Finnhub.
    const formattedSymbol = symbol.endsWith('.CA') ? symbol : `${symbol.toUpperCase()}.CA`;

    try {
        const response = await fetch(`${BASE_URL}/quote?symbol=${formattedSymbol}&token=${FINNHUB_API_KEY}`);
        
        if (!response.ok) {
            console.error('Failed to fetch stock quote from Finnhub:', response.status, response.statusText);
            return { data: null, error: 'فشل الاتصال بالخادم' };
        }
        
        const data = await response.json();

        // Finnhub returns current price 'c' as 0 if symbol not found or no recent trade.
        if (!data || data.c === 0) {
            console.warn(`No data received from Finnhub for symbol: ${formattedSymbol}`);
            return { data: null, error: 'لا توجد بيانات للسهم' };
        }
        
        return { data: data as Quote, error: null };
    } catch (error) {
        console.error('Error fetching stock quote from Finnhub:', error);
        return { data: null, error: 'حدث خطأ في الشبكة' };
    }
};
