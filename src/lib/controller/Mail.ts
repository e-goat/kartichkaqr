import { Resend } from "resend";
import { RESEND_API_KEY } from "$lib/server/secrets";
import { render } from "svelte/server";
import EmailTemplate from "$lib/components/EmailTemplate.svelte";

class Mail {
    #resend: Resend;

    constructor() {
        this.#resend = new Resend(RESEND_API_KEY);
    }

    async send({
        to,
        from,
        name,
        title,
        senderName,
        description,
    }: {
        to: string;
        from: string;
        name: string;
        title: string;
        senderName: string;
        description: string;
    }) {
        try {
            const { body } = render(EmailTemplate, {
                props: {
                    recipientName: name,
                    senderName,
                    title,
                    description,
                },
            });

            const { data, error } = await this.#resend.emails.send({
                from: process.env.APP_EMAIL || from,
                to: [process.env.ADMIN_EMAIL || "", to],
                subject: title,
                html: body,
            });

            if (error) {
                console.error({
                    error: error,
                    status: 500,
                });
            }

            return data;
        } catch (error) {
            console.error({
                error: error,
                status: 500,
            });
            throw error;
        }
    }
}

export const MailController = new Mail();
