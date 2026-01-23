/**
 * Client-side Google Sheets Fetcher
 * Fetches published XLSX files directly from Google Sheets
 */

import { TaskWithStatus } from '@/types';
import { parseXLSXFile, computeTaskStatus } from './dataParser';
import { normalizeSiteWeights } from './dataProcessor';

export interface SheetSource {
    packageId: string;
    packageName: string;
    publishedXlsxUrl: string;
}

export const SHEET_SOURCES: SheetSource[] = [
    {
        packageId: 'FP1',
        packageName: 'Flood Package-1',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUvCNby9_znIiirFF8TFvaxJZOShZBlUpojKTpdEnQHxeyk6OMZxjN21r8dsBZOUNRc_cHFbcql7--/pub?output=xlsx',
    },
    {
        packageId: 'FP2',
        packageName: 'Flood Package-2',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQv5GK2QLH1avgzt1ZPVESAFL-lXV5S3QuldW8fsmBYM5fxv6UmLC2Wrww3Pv7lqkBhdKdUZRzWsfeP/pub?output=xlsx',
    },
    {
        packageId: 'FP3',
        packageName: 'Flood Package-3',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuPg-9VWBqev1bs_AZYKqQV6-9C8wlVyo2y6ewjNMxwLuEzm1OXURKZrLDb6O2dTsdpJ9iIYKIlnyo/pub?output=xlsx',
    },
    {
        packageId: 'FP4',
        packageName: 'Flood Package-4',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlUGmqa0SjavAOLnVML_IMAIvnVw5Jtza3z7Tr-norg6yIZYv4GPR6BVGnj7ox7Tshwz6ZrFSxhJTr/pub?output=xlsx',
    },
    {
        packageId: 'FP5',
        packageName: 'Flood Package-5',
        publishedXlsxUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS8lttkvWeCBNiQwY9N1yuuQqVLuKUi809JkBh9wD15ko31JlqNwvFrHpAMDf3kxrz63-Acul7jM3es/pub?output=xlsx',
    },
];

/**
 * Fetch and parse a single published Google Sheet XLSX file
 */
async function fetchSheetAsXLSX(source: SheetSource): Promise<TaskWithStatus[]> {
    try {
        console.log(`Fetching ${source.packageId} from published XLSX...`);

        const response = await fetch(source.publishedXlsxUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Convert response to Blob, then to File
        const blob = await response.blob();
        const file = new File([blob], `${source.packageId}.xlsx`, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Use existing parseXLSXFile function
        const tasks = await parseXLSXFile(file);

        // Compute status for each task
        const tasksWithStatus = tasks.map(task => computeTaskStatus(task));

        console.log(`✅ ${source.packageId}: Loaded ${tasksWithStatus.length} tasks`);
        return tasksWithStatus;
    } catch (error) {
        console.error(`❌ ${source.packageId}: Failed to fetch`, error);
        return [];
    }
}

/**
 * Fetch all published Google Sheets and combine into processed tasks
 */
export async function fetchAllGoogleSheets(): Promise<TaskWithStatus[]> {
    console.log('=== FETCHING ALL GOOGLE SHEETS ===');
    const startTime = Date.now();

    // Fetch all sheets in parallel
    const results = await Promise.all(
        SHEET_SOURCES.map(source => fetchSheetAsXLSX(source))
    );

    // Combine all tasks
    const allTasks = results.flat();
    console.log(`Total raw tasks: ${allTasks.length}`);

    // Deduplicate by task_uid
    const taskMap = new Map<string, TaskWithStatus>();
    allTasks.forEach(task => {
        if (!taskMap.has(task.task_uid)) {
            taskMap.set(task.task_uid, task);
        }
    });

    const uniqueTasks = Array.from(taskMap.values());
    console.log(`Deduplicated to ${uniqueTasks.length} unique tasks`);

    // Normalize weights per site
    const normalizedTasks = normalizeSiteWeights(uniqueTasks);

    const endTime = Date.now();
    console.log(`=== FETCH COMPLETE (${endTime - startTime}ms) ===`);

    return normalizedTasks;
}
