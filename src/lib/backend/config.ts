/**
 * Data source configuration for Google Sheets ingestion
 */

export interface SheetSource {
    packageId: string;
    packageName: string;
    sheetId: string;
    sheetUrl: string;
}

export const SHEET_SOURCES: SheetSource[] = [
    {
        packageId: 'FP1',
        packageName: 'Flood Package-1',
        sheetId: '1Wp3HeM-DcNPZHgjpLEg-toZshthLQW6pq6WYu62Teo0',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1Wp3HeM-DcNPZHgjpLEg-toZshthLQW6pq6WYu62Teo0',
    },
    {
        packageId: 'FP2',
        packageName: 'Flood Package-2',
        sheetId: '1PP9d5o5clqhUCqKOGDEO0Nji4utoFUAuMgpfKFU8pAc',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1PP9d5o5clqhUCqKOGDEO0Nji4utoFUAuMgpfKFU8pAc',
    },
    {
        packageId: 'FP3',
        packageName: 'Flood Package-3',
        sheetId: '1_5WIrLtNiMJNGOj7d4yFuGb9O93BgHJaYiFxHYE4aug',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1_5WIrLtNiMJNGOj7d4yFuGb9O93BgHJaYiFxHYE4aug',
    },
    {
        packageId: 'FP4',
        packageName: 'Flood Package-4',
        sheetId: '1fmDN1k1spAe-I6YjruBtvNo3QjfJZVw752nE8XEcaoI',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1fmDN1k1spAe-I6YjruBtvNo3QjfJZVw752nE8XEcaoI',
    },
    {
        packageId: 'FP5',
        packageName: 'Flood Package-5',
        sheetId: '1de7h9eyi1UxFYer8e-6-ooro9JIQCcbLPG1BBWhjmEQ',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1de7h9eyi1UxFYer8e-6-ooro9JIQCcbLPG1BBWhjmEQ',
    },
];

export const CONFIG = {
    tabName: 'Data_Entry',
    range: 'A:U',
    cacheIntervalMs: 30 * 60 * 1000, // 30 minutes
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || '', // Optional for public sheets
};
