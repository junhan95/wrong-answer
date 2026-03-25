import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    path?: string;
    image?: string;
}

const BASE_TITLE = '오답노트';
const BASE_URL = 'https://wrong-answer.ai';
const DEFAULT_DESC = '틀린 이유 속에 정답이 있다. AI가 오답의 원인을 분석하고, 맞춤형 유사 문제로 완전히 정복할 때까지 도와줍니다.';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.svg`;

export function SEO({ title, description, path = '', image }: SEOProps) {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} - AI 맞춤형 오답 분석 학습 솔루션`;
    const desc = description || DEFAULT_DESC;
    const url = `${BASE_URL}${path}`;
    const ogImage = image || DEFAULT_OG_IMAGE;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={url} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
}
