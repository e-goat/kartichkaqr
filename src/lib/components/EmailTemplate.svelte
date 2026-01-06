<script>
    let {
        recipientName,
        description,
        title,
        cardId,
        senderName,
        senderEmail,
        senderPhone,
        senderAddress,
        cardUrl,
    } = $props();
</script>

<p
    style="margin: 0 0 20px 0; font-size: 14px; color: #666666; line-height: 1.5; text-align: center;"
>
    Получена е нова поръчка за физическа картичка. Детайлите са показани
    по-долу.
</p>

<table
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff; border: 1px solid #e5e5e5;"
>
    <tbody>
        <tr>
            <td
                style="padding: 30px 24px; background-color: #f8f9fa; border-bottom: 2px solid #e5e5e5; text-align: center;"
            >
                <h1
                    style="margin: 0; font-size: 24px; font-weight: 600; color: #333333; line-height: 1.3;"
                >
                    Нова поръчка!
                </h1>
                <p
                    style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #555555; line-height: 1.3;"
                >
                    ID на картичката: <strong>#{cardId}</strong>
                </p>
            </td>
        </tr>

        <!-- Main Content Area -->
        <tr>
            <td style="padding: 30px 24px; background-color: #ffffff;">
                <!-- Greeting Section -->
                <p
                    style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.5;"
                >
                    Dear <strong>{recipientName}</strong>,
                </p>

                <!-- Card Details Section -->
                <div
                    style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e5e5e5;"
                >
                    <h2
                        style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #333333;"
                    >
                        Детайли за картичката:
                    </h2>
                    <p
                        style="margin: 0 0 10px 0; font-size: 15px; color: #333333; line-height: 1.6;"
                    >
                        <strong>Заглавие:</strong>
                        {title}
                    </p>
                    {#if description}
                        <p
                            style="margin: 0 0 10px 0; font-size: 15px; color: #333333; line-height: 1.6;"
                        >
                            <strong>Описание:</strong>
                            {description}
                        </p>
                    {/if}
                </div>

                <!-- Sender Information Section -->
                <div
                    style="margin: 20px 0; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5;"
                >
                    <h2
                        style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #333333;"
                    >
                        Информация за подателя:
                    </h2>
                    <p
                        style="margin: 0 0 8px 0; font-size: 15px; color: #333333; line-height: 1.6;"
                    >
                        <strong>Име:</strong>
                        {senderName}
                    </p>
                    {#if senderEmail}
                        <p
                            style="margin: 0 0 8px 0; font-size: 15px; color: #333333; line-height: 1.6;"
                        >
                            <strong>Имейл:</strong>{" "}
                            <a
                                href="mailto:{senderEmail}"
                                style="color: #2563eb; text-decoration: none;"
                            >
                                {senderEmail}
                            </a>
                        </p>
                    {/if}
                    {#if senderPhone}
                        <p
                            style="margin: 0 0 8px 0; font-size: 15px; color: #333333; line-height: 1.6;"
                        >
                            <strong>Телефон:</strong>{" "}
                            <a
                                href="tel:{senderPhone}"
                                style="color: #2563eb; text-decoration: none;"
                            >
                                {senderPhone}
                            </a>
                        </p>
                    {/if}
                    {#if senderAddress}
                        <p
                            style="margin: 0 0 8px 0; font-size: 15px; color: #333333; line-height: 1.6;"
                        >
                            <strong>Адрес:</strong>
                            {senderAddress}
                        </p>
                    {/if}
                </div>

                <!-- QR Code Section -->
                {#if cardUrl}
                    <div
                        style="margin: 20px 0; padding: 20px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; text-align: center;"
                    >
                        <h2
                            style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #333333;"
                        >
                            QR код на картичката:
                        </h2>
                        <p
                            style="margin: 0 0 15px 0; font-size: 14px; color: #666666; line-height: 1.5;"
                        >
                            Моля, сканирайте QR кода или кликнете на линка
                            по-долу, за да видите картичката:
                        </p>
                        <p style="margin: 0 0 15px 0;">
                            <a
                                href={cardUrl}
                                style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500;"
                            >
                                Отвори картичката
                            </a>
                        </p>
                        <p
                            style="margin: 15px 0 0 0; font-size: 12px; color: #999999; word-break: break-all;"
                        >
                            {cardUrl}
                        </p>
                    </div>
                {/if}

                <hr
                    style="border: none; border-top: 1px solid #e5e5e5; margin: 25px 0;"
                />
            </td>
        </tr>

        <!-- Footer Section -->
        <tr>
            <td
                style="padding: 20px 24px; background-color: #f8f9fa; border-top: 1px solid #e5e5e5; text-align: center;"
            >
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                    <strong>KartichkaQR</strong>
                </p>
            </td>
        </tr>
    </tbody>
</table>
