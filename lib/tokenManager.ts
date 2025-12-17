import fs from 'fs';
import path from 'path';

const USAGE_FILE = path.join(process.cwd(), 'token-usage.json');
const DAILY_LIMIT = 50000;

interface UsageData {
    date: string;
    tokens: number;
}

const getCurrentDate = () => new Date().toISOString().split('T')[0];

function getUsage(): UsageData {
    try {
        if (!fs.existsSync(USAGE_FILE)) {
            return { date: getCurrentDate(), tokens: 0 };
        }
        const data = fs.readFileSync(USAGE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading usage file:', error);
        return { date: getCurrentDate(), tokens: 0 };
    }
}

function saveUsage(data: UsageData) {
    try {
        fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving usage file:', error);
    }
}

export function checkTokenLimit(): { allowed: boolean; remaining: number; resetDate: string } {
    const current = getUsage();
    const today = getCurrentDate();

    // Reset if new day
    if (current.date !== today) {
        current.date = today;
        current.tokens = 0;
        saveUsage(current);
    }

    const remaining = Math.max(0, DAILY_LIMIT - current.tokens);
    return {
        allowed: current.tokens < DAILY_LIMIT,
        remaining,
        resetDate: today
    };
}

export function trackUsage(tokensUsed: number) {
    const current = getUsage();
    const today = getCurrentDate();

    if (current.date !== today) {
        current.date = today;
        current.tokens = 0;
    }

    current.tokens += tokensUsed;
    saveUsage(current);
    console.log(`[TokenManager] Added ${tokensUsed} tokens. Total today: ${current.tokens}/${DAILY_LIMIT}`);
}
