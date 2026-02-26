package kr.co.booktalk.client

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper

interface MailClient {
    fun send(request: SendMailRequest)
}

data class SendMailRequest(
    val to: String,
    val subject: String,
    val html: String,
)

class JavaMailSenderMailClient(
    private val mailSender: JavaMailSender,
    private val fromEmail: String,
    private val fromName: String,
) : MailClient {
    override fun send(request: SendMailRequest) {
        val message = mailSender.createMimeMessage()
        MimeMessageHelper(message, "UTF-8").apply {
            setFrom(fromEmail, fromName)
            setTo(request.to)
            setSubject(request.subject)
            setText(request.html, true)
        }
        mailSender.send(message)
    }
}

class NoOpMailClient : MailClient {
    private val logger = KotlinLogging.logger {}

    override fun send(request: SendMailRequest) {
        logger.warn { "[NoOp] mail send: $request" }
    }
}
