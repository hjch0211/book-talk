plugins {
    kotlin("jvm")
    kotlin("plugin.spring")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

description = "book-talk library"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("io.github.oshai:kotlin-logging-jvm:6.0.3")
    implementation("at.favre.lib:bcrypt:0.10.2")
    api("com.auth0:java-jwt:4.4.0")
    implementation(libs.bundles.ktor.client)
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
    jvmToolchain(21)
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.bootJar {
    enabled = false
}

tasks.jar {
    enabled = true
}
