package kr.co.booktalk.domain.openGraph

import io.github.oshai.kotlinlogging.KotlinLogging
import org.jsoup.Jsoup
import org.springframework.stereotype.Service
import java.io.IOException

@Service
class OpenGraphService {
    private val logger = KotlinLogging.logger {}

    fun getOGData(url: String): FetchOpenGraphResponse {
        try {
            val document = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .timeout(5000)
                .get()

            val title = document.select("meta[property=og:title]").attr("content").takeIf { it.isNotBlank() }
                ?: document.select("meta[name=og:title]").attr("content").takeIf { it.isNotBlank() }
                ?: document.title().takeIf { it.isNotBlank() }

            val description =
                document.select("meta[property=og:description]").attr("content").takeIf { it.isNotBlank() }
                    ?: document.select("meta[name=og:description]").attr("content").takeIf { it.isNotBlank() }
                    ?: document.select("meta[name=description]").attr("content").takeIf { it.isNotBlank() }

            val image = document.select("meta[property=og:image]").attr("content").takeIf { it.isNotBlank() }
                ?: document.select("meta[name=og:image]").attr("content").takeIf { it.isNotBlank() }

            val siteName = document.select("meta[property=og:site_name]").attr("content").takeIf { it.isNotBlank() }
                ?: document.select("meta[name=og:site_name]").attr("content").takeIf { it.isNotBlank() }

            val type = document.select("meta[property=og:type]").attr("content").takeIf { it.isNotBlank() }
                ?: document.select("meta[name=og:type]").attr("content").takeIf { it.isNotBlank() }

            return FetchOpenGraphResponse(
                url = url,
                title = title,
                description = description,
                image = image,
                siteName = siteName,
                type = type
            )
        } catch (e: IOException) {
            logger.warn { "OpenGraph 데이터 조회 실패: $url - ${e.message}" }
            throw IllegalArgumentException("URL을 불러올 수 없습니다: ${e.message}")
        } catch (e: Exception) {
            logger.error(e) { "OpenGraph 데이터 파싱 중 오류 발생: $url" }
            throw IllegalArgumentException("OpenGraph 데이터를 파싱할 수 없습니다: ${e.message}")
        }
    }
}