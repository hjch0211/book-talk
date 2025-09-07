package kr.co.booktalk.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(
    LibProperties::class,
)
class PropertiesConfig