package kr.co.booktalk.config

import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@EnableJpaRepositories(basePackages = ["kr.co.booktalk.domain"])
@EntityScan(basePackages = ["kr.co.booktalk.domain"])
class JpaConfig