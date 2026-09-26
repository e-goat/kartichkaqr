import { Resend } from "resend";
import { RESEND_API_KEY } from "$lib/server/secrets";
import { render } from "svelte/server";
import EmailTemplate from "$lib/components/EmailTemplate.svelte";

class Mail {
    #resend: Resend | null = null;

    // Created on first use: Resend throws without a key, and environments
    // such as Vercel previews intentionally have none.
    get #client(): Resend | null {
        if (!RESEND_API_KEY) return null;
        this.#resend ??= new Resend(RESEND_API_KEY);
        return this.#resend;
    }

    async send({
        to,
        from,
        name,
        title,
        cardTitle,
        senderName,
        cardDescription,
        cardId,
        senderEmail,
        senderPhone,
        senderAddress,
        cardUrl,
        senderComment,
    }: {
        to: string;
        from: string;
        name: string;
        title: string;
        cardTitle: string;
        senderName: string;
        cardDescription: string;
        cardId: number;
        senderEmail: string;
        senderPhone: string;
        senderAddress: string;
        cardUrl: string;
        senderComment: string;
    }) {
        const client = this.#client;
        if (!client) {
            console.warn(`RESEND_API_KEY not set, skipping email: ${title}`);
            return null;
        }

        try {
            const { body } = render(EmailTemplate, {
                props: {
                    recipientName: name,
                    title,
                    cardTitle,
                    cardDescription,
                    cardId,
                    senderName,
                    senderEmail,
                    senderPhone,
                    senderAddress,
                    cardUrl,
                    senderComment,
                },
            });

            const { data, error } = await client.emails.send({
                from: from,
                to: [to],
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
        }
    }
}

export const MailController = new Mail();
