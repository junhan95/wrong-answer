import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    path?: string;
}

const BASE_TITLE = '오답노트';
const BASE_URL = 'https://wrong-answer.ai';
const DEFAULT_DESC = '틀린 이유 속에 정답이 있다. AI가 오답의 원인을 분석하고, 맞춤형 유사 문제로 완전히 정복할 때까지 도와줍니다.';

export function SEO({ title, description, path = '' }: SEOProps) {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} - AI 맞춤형 오답 분석 학습 솔루션`;
    const desc = description || DEFAULT_DESC;
    const url = `${BASE_URL}${path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={desc} />
        </Helmet>
    );
}
