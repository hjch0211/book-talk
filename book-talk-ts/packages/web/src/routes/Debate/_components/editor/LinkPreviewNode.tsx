import LinkIcon from '@mui/icons-material/Link';
import { Box, Card, CardContent, CircularProgress, Link, Typography } from '@mui/material';
import type { FetchOpenGraphResponse } from '@src/externals/presentation';
import { fetchOpenGraph } from '@src/externals/presentation';
import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';

interface LinkPreviewAttrs {
  url: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  siteName?: string | null;
  type?: string | null;
}

export function LinkPreviewNode({ node, updateAttributes }: NodeViewProps) {
  const [loading, setLoading] = useState(false);
  const attrs = node.attrs as LinkPreviewAttrs;
  const { url, title, image, siteName } = attrs;

  useEffect(() => {
    // 이미 OpenGraph 데이터가 있으면 API 호출하지 않음
    if (title !== undefined && title !== null) {
      return;
    }

    // URL이 없으면 API 호출하지 않음
    if (!url) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        const data: FetchOpenGraphResponse = await fetchOpenGraph(url);

        updateAttributes({
          title: data.title,
          description: data.description,
          image: data.image,
          siteName: data.siteName,
          type: data.type,
        });
      } catch (err) {
        console.error('Failed to fetch OpenGraph data:', err);
        updateAttributes({
          title: '',
          description: '',
          image: '',
          siteName: '',
          type: '',
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [url, title, updateAttributes]);

  // 로딩 상태
  if (loading) {
    return (
      <NodeViewWrapper>
        <Card
          sx={{
            maxWidth: 640,
            margin: '16px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
          }}
        >
          <CircularProgress size={32} />
        </Card>
      </NodeViewWrapper>
    );
  }

  // OG 데이터가 없는 경우 (fetch 실패 포함) — 일반 링크 카드
  if (title === '' || title === null) {
    return (
      <NodeViewWrapper>
        <Card
          sx={{
            maxWidth: 640,
            margin: '16px 0',
            border: '1px solid #e0e0e0',
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <LinkIcon color="action" />
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: '0.875rem',
                  wordBreak: 'break-all',
                }}
              >
                {url}
              </Link>
            </Box>
          </CardContent>
        </Card>
      </NodeViewWrapper>
    );
  }

  // 정상적인 링크 미리보기
  return (
    <NodeViewWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px 0px 0px 32px',
          gap: '20px',
          width: '640px',
          height: '120px',
          background: '#FFFFFF',
          border: '1px solid #E8EBFF',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
          boxSizing: 'border-box',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#F7F8FF',
          },
        }}
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            width: '420px',
            flex: 'none',
            order: 0,
            flexGrow: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'S-Core Dream',
              fontWeight: 500,
              fontSize: '16px',
              letterSpacing: '1px',
              color: '#434343',
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 200,
              fontSize: '14px',
              letterSpacing: '0.3px',
              color: '#7B7B7B',
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {siteName}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '148px',
            background: '#000000',
            borderRadius: '0px 12px 12px 0px',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 1,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {image ? (
            <Box
              component="img"
              src={image}
              alt={title || 'Link preview'}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.3px',
                color: '#FFFFFF',
              }}
            >
              사진
            </Typography>
          )}
        </Box>
      </Box>
    </NodeViewWrapper>
  );
}
