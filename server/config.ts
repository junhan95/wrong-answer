/**
 * 서버 시작 시 필수 환경변수를 한 곳에서 검증합니다.
 * 누락된 변수가 있으면 명확한 메시지와 함께 프로세스를 종료합니다.
 */

interface EnvConfig {
    DATABASE_URL: string;
    SESSION_SECRET: string;
    OPENAI_API_KEY: string;
    // 선택적 환경변수
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    NAVER_CLIENT_ID?: string;
    NAVER_CLIENT_SECRET?: string;
    KAKAO_CLIENT_ID?: string;
    NODE_ENV?: string;
    PORT?: string;
}

const REQUIRED_VARS = ["DATABASE_URL", "SESSION_SECRET", "OPENAI_API_KEY"] as const;

function validateEnv(): EnvConfig {
    const missing: string[] = [];

    for (const key of REQUIRED_VARS) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        console.error(
            `[Config] 필수 환경변수가 설정되지 않았습니다:\n  ${missing.join("\n  ")}\n` +
            `[Config] .env 파일 또는 환경변수 설정을 확인하세요.`
        );
        process.exit(1);
    }

    return {
        DATABASE_URL: process.env.DATABASE_URL!,
        SESSION_SECRET: process.env.SESSION_SECRET!,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
        NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
        KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
    };
}

export const config = validateEnv();
