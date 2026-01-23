/**
 * Google Sheets Client - Fetches data from public Google Sheets
 * Uses the public CSV export API (no authentication required)
 */

import { SHEET_SOURCES, CONFIG } from './config';
import type { Task } from '@/types';
import { parseDMY } from '../dataParser';

interface RawSheetRow {
    [key: string]: string | number | null;
}

/**
 * Fetch data from a single Google Sheet using public CSV export
 * Falls back to Google Sheets API v4 if available
 */
async function fetchSheetData(sheetId: string): Promise<RawSheetRow[]> {
    try {
        // Method 1: Use Google Sheets API v4 (if API key available)
        if (CONFIG.apiKey) {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${CONFIG.tabName}!${CONFIG.range}?key=${CONFIG.apiKey}&valueRenderOption=UNFORMATTED_VALUE`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Google Sheets API error: ${response.statusText}`);
            }

            const data = await response.json();
            const rows = data.values as (string | number | null)[][];

            if (!rows || rows.length < 2) {
                return [];
            }

            // Convert to objects using first row as headers
            const headers = rows[0];
            return rows.slice(1).map(row => {
                const obj: RawSheetRow = {};
                headers.forEach((header, i) => {
                    obj[String(header)] = row[i] ?? null;
                });
                return obj;
            });
        }

        // Method 2: Parse public CSV export (fallback, no API key needed)
        // Note: This exports as TSV for Data_Entry tab
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=tsv&gid=0`;

        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }

        const text = await response.text();
        const rows = text.split('\n').map(line => line.split('\t'));

        if (rows.length < 2) {
            return [];
        }

        const headers = rows[0];
        return rows.slice(1).map(row => {
            const obj: RawSheetRow = {};
            headers.forEach((header, i) => {
                const value = row[i]?.trim();
                obj[header] = value && value !== '' ? value : null;
            });
            return obj;
        });
    } catch (error) {
        console.error(`Error fetching sheet ${sheetId}:`, error);
        throw error;
    }
}

/**
 * Fetch all Google Sheets in parallel
 */
export async function fetchAllSheets(): Promise<Map<string, RawSheetRow[]>> {
    console.log('Fetching data from Google Sheets...');

    const results = await Promise.allSettled(
        SHEET_SOURCES.map(async (source) => ({
            packageId: source.packageId,
            rows: await fetchSheetData(source.sheetId),
        }))
    );

    const dataMap = new Map<string, RawSheetRow[]>();

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            const { packageId, rows } = result.value;
            dataMap.set(packageId, rows);
            console.log(`✅ Fetched ${rows.length} rows from ${packageId}`);
        } else {
            const packageId = SHEET_SOURCES[index].packageId;
            console.error(`❌ Failed to fetch ${packageId}:`, result.reason);
            dataMap.set(packageId, []);
        }
    });

    return dataMap;
}

/**
 * Map raw sheet rows to Task objects
 * Columns A:U mapping
 */
export function mapRowToTask(row: RawSheetRow, packageId: string, packageName: string): Task | null {
    try {
        // Skip empty rows
        if (!row['Site ID'] && !row['site_id']) {
            return null;
        }

        // Handle both possible header formats
        const getValue = (key1: string, key2: string): string => {
            const val = row[key1] || row[key2];
            return val ? String(val).trim() : '';
        };

        const getNumber = (key1: string, key2: string): number | null => {
            const val = row[key1] || row[key2];
            if (val === null || val === undefined || val === '') return null;
            const num = Number(val);
            return isNaN(num) ? null : num;
        };

        return {
            package_id: packageId,
            package_name: packageName,
            district: getValue('District', 'district'),
            site_id: getValue('Site ID', 'site_id'),
            site_name: getValue('Site Name', 'site_name'),
            discipline: getValue('Discipline', 'discipline'),
            task_name: getValue('Task Name', 'task_name'),
            planned_start: parseDMY(getValue('Planned Start', 'planned_start')),
            planned_finish: parseDMY(getValue('Planned Finish', 'planned_finish')),
            planned_duration_days: getNumber('Planned Duration (Days)', 'planned_duration_days'),
            actual_start: parseDMY(getValue('Actual Start', 'actual_start')),
            actual_finish: parseDMY(getValue('Actual Finish', 'actual_finish')),
            progress_pct: getNumber('Progress %', 'progress_pct'),
            Variance: getNumber('Variance', 'Variance'),
            delay_flag_calc: getValue('Delay Flag', 'delay_flag_calc'),
            last_updated: parseDMY(getValue('Last Updated', 'last_updated')),
            remarks: getValue('Remarks', 'remarks'),
            photo_folder_url: getValue('Photo Folder', 'photo_folder_url'),
            cover_photo_share_url: getValue('Cover Photo', 'cover_photo_share_url'),
            before_photo_share_url: getValue('Before Photo', 'before_photo_share_url'),
            after_photo_share_url: getValue('After Photo', 'after_photo_share_url'),
            cover_photo_direct_url: null,
            before_photo_direct_url: null,
            after_photo_direct_url: null,
        };
    } catch (error) {
        console.error('Error mapping row to task:', error, row);
        return null;
    }
}
