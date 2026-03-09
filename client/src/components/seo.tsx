import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    path?: string;
}

const BASE_TITLE = 'WiseQuery';
const BASE_URL = 'https://wisequery.app';
const DEFAULT_DESC = '프로젝트별로 대화를 정리하고, 어디서든 질문하세요. 고급 RAG 기술로 전체 지식 베이스에서 답변을 얻으세요.';

export function SEO({ title, description, path = '' }: SEOProps) {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} - AI 기반 지식 관리 플랫폼`;
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
