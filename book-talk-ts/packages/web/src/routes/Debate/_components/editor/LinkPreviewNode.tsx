import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinkIcon from '@mui/icons-material/Link';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import type { FetchOpenGraphResponse } from '@src/apis/presentation';
import { fetchOpenGraph } from '@src/apis/presentation';
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
  const [error, setError] = useState<string | null>(null);
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
      setError(null);

      try {
        const data: FetchOpenGraphResponse = await fetchOpenGraph(url);

        // 가져온 데이터로 노드 속성 업데이트
        updateAttributes({
          title: data.title,
          description: data.description,
          image: data.image,
          siteName: data.siteName,
          type: data.type,
        });
      } catch (err) {
        console.error('Failed to fetch OpenGraph data:', err);
        setError('링크 미리보기를 가져올 수 없습니다.');
        // 에러 발생 시 빈 값으로 업데이트해서 재시도 방지
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

    fetchData();
  }, [url, title, updateAttributes]);

  // 로딩 상태
  if (loading) {
    return (
      <NodeViewWrapper>
        <Card
          sx={{
            maxWidth: 720,
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

  // 에러 상태
  if (error) {
    return (
      <NodeViewWrapper>
        <Card
          sx={{
            maxWidth: 720,
            margin: '16px 0',
            border: '1px solid #f44336',
            backgroundColor: '#ffebee',
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <ErrorOutlineIcon color="error" />
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Box>
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'block',
                marginTop: 1,
                fontSize: '0.875rem',
                wordBreak: 'break-all',
              }}
            >
              {url}
            </Link>
          </CardContent>
        </Card>
      </NodeViewWrapper>
    );
  }

  // OpenGraph 데이터가 없는 경우 (빈 문자열인 경우)
  if (title === '' || title === null) {
    return (
      <NodeViewWrapper>
        <Card
          sx={{
            maxWidth: 720,
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
      <Card
        sx={{
          maxWidth: 720,
          margin: '16px 0',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s',
          display: 'flex',
          flexDirection: 'row',
          '&:hover': {
            boxShadow: 4,
          },
        }}
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      >
        {image && (
          <CardMedia
            component="img"
            image={image}
            alt={title || 'Link preview'}
            sx={{
              width: 100,
              height: 100,
              minWidth: 100,
              objectFit: 'cover',
            }}
          />
        )}
        <CardContent
          sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          {siteName && (
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {siteName}
            </Typography>
          )}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </NodeViewWrapper>
  );
}
