<script>
    let { recipientName, description, title } = $props();
</script>

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
