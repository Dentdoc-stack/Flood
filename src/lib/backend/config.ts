/**
 * Data source configuration for Google Sheets ingestion
 */

export interface SheetSource {
    packageId: string;
    packageName: string;
    sheetId: string;
    sheetUrl: string;
    publishedXlsxUrl: string; // For direct XLSX access without API key
}

export const SHEET_SOURCES: SheetSource[] = [
    {
        packageId: 'FP1',
        packageName: 'Flood Package-1',
        sheetId: '1Wp3HeM-DcNPZHgjpLEg-toZshthLQW6pq6WYu62Teo0',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1Wp3HeM-DcNPZHgjpLEg-toZshthLQW6pq6WYu62Teo0',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUvCNby9_znIiirFF8TFvaxJZOShZBlUpojKTpdEnQHxeyk6OMZxjN21r8dsBZOUNRc_cHFbcql7--/pub?output=xlsx',
    },
    {
        packageId: 'FP2',
        packageName: 'Flood Package-2',
        sheetId: '1PP9d5o5clqhUCqKOGDEO0Nji4utoFUAuMgpfKFU8pAc',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1PP9d5o5clqhUCqKOGDEO0Nji4utoFUAuMgpfKFU8pAc',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQv5GK2QLH1avgzt1ZPVESAFL-lXV5S3QuldW8fsmBYM5fxv6UmLC2Wrww3Pv7lqkBhdKdUZRzWsfeP/pub?output=xlsx',
    },
    {
        packageId: 'FP3',
        packageName: 'Flood Package-3',
        sheetId: '1_5WIrLtNiMJNGOj7d4yFuGb9O93BgHJaYiFxHYE4aug',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1_5WIrLtNiMJNGOj7d4yFuGb9O93BgHJaYiFxHYE4aug',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuPg-9VWBqev1bs_AZYKqQV6-9C8wlVyo2y6ewjNMxwLuEzm1OXURKZrLDb6O2dTsdpJ9iIYKIlnyo/pub?output=xlsx',
    },
    {
        packageId: 'FP4',
        packageName: 'Flood Package-4',
        sheetId: '1fmDN1k1spAe-I6YjruBtvNo3QjfJZVw752nE8XEcaoI',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1fmDN1k1spAe-I6YjruBtvNo3QjfJZVw752nE8XEcaoI',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlUGmqa0SjavAOLnVML_IMAIvnVw5Jtza3z7Tr-norg6yIZYv4GPR6BVGnj7ox7Tshwz6ZrFSxhJTr/pub?output=xlsx',
    },
    {
        packageId: 'FP5',
        packageName: 'Flood Package-5',
        sheetId: '1de7h9eyi1UxFYer8e-6-ooro9JIQCcbLPG1BBWhjmEQ',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1de7h9eyi1UxFYer8e-6-ooro9JIQCcbLPG1BBWhjmEQ',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS8lttkvWeCBNiQwY9N1yuuQqVLuKUi809JkBh9wD15ko31JlqNwvFrHpAMDf3kxrz63-Acul7jM3es/pub?output=xlsx',
    },
];

export const CONFIG = {
    tabName: 'Data_Entry',
    range: 'A:U',
    cacheIntervalMs: 30 * 60 * 1000, // 30 minutes
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || '', // Optional for public sheets
};
