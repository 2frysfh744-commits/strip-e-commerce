import "server-only";

export type OrderNotificationItem = {
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type NewOrderNotification = {
  orderId: number;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  postalCode: string | null;
  address: string;
  deliveryInstructions: string | null;
  items: OrderNotificationItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

const defaultNotificationEmail = "yourstripbrand@gmail.com";
const defaultSender = "STRIP Orders <onboarding@resend.dev>";
const defaultSiteUrl = "https://strip-e-commerce.vercel.app";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(value: number) {
  return `${value.toLocaleString("en-US")} MAD`;
}

function getAdminOrdersUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || defaultSiteUrl;

  try {
    return new URL("/admin/orders", configuredUrl).toString();
  } catch {
    return `${defaultSiteUrl}/admin/orders`;
  }
}

function createTextEmail(order: NewOrderNotification) {
  const itemLines = order.items.map(
    (item) =>
      `- ${item.name} | Size ${item.size} | Qty ${item.quantity} | ${formatMoney(item.lineTotal)}`
  );

  return [
    `New STRIP order #${order.orderId}`,
    "",
    `Customer: ${order.fullName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `Address: ${order.address}, ${order.city}${
      order.postalCode ? `, ${order.postalCode}` : ""
    }`,
    order.deliveryInstructions
      ? `Delivery notes: ${order.deliveryInstructions}`
      : "Delivery notes: None",
    "",
    "Items:",
    ...itemLines,
    "",
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Delivery: ${formatMoney(order.deliveryFee)}`,
    `Total: ${formatMoney(order.total)}`,
    "Payment: Cash on delivery",
    "",
    `Manage order: ${getAdminOrdersUrl()}`,
  ].join("\n");
}

function createHtmlEmail(order: NewOrderNotification) {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #e5e5e5;">
            <strong>${escapeHtml(item.name)}</strong><br />
            <span style="color:#666;font-size:13px;">Size ${escapeHtml(item.size)}</span>
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #e5e5e5;text-align:center;">${item.quantity}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #e5e5e5;text-align:right;">${escapeHtml(
            formatMoney(item.lineTotal)
          )}</td>
        </tr>`
    )
    .join("");

  const address = [order.address, order.city, order.postalCode]
    .filter(Boolean)
    .join(", ");

  return `<!doctype html>
  <html lang="en">
    <body style="margin:0;background:#f3f1ed;color:#171717;font-family:Arial,Helvetica,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;">New STRIP order #${order.orderId} for ${escapeHtml(
        formatMoney(order.total)
      )}</div>
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
        <div style="background:#111;color:#fff;padding:26px 30px;">
          <p style="margin:0;font-size:12px;letter-spacing:4px;">STRIP</p>
          <h1 style="margin:14px 0 0;font-size:30px;font-weight:500;">New order #${order.orderId}</h1>
        </div>

        <div style="background:#fff;padding:28px 30px;">
          <p style="margin:0 0 8px;color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Customer</p>
          <h2 style="margin:0 0 18px;font-size:22px;">${escapeHtml(order.fullName)}</h2>
          <p style="margin:6px 0;"><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
          <p style="margin:6px 0;"><strong>Email:</strong> ${escapeHtml(order.email)}</p>
          <p style="margin:6px 0;"><strong>Address:</strong> ${escapeHtml(address)}</p>
          <p style="margin:6px 0;"><strong>Delivery notes:</strong> ${escapeHtml(
            order.deliveryInstructions || "None"
          )}</p>

          <table style="width:100%;border-collapse:collapse;margin-top:28px;font-size:14px;">
            <thead>
              <tr>
                <th style="padding:10px 8px;border-bottom:2px solid #171717;text-align:left;">Item</th>
                <th style="padding:10px 8px;border-bottom:2px solid #171717;text-align:center;">Qty</th>
                <th style="padding:10px 8px;border-bottom:2px solid #171717;text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div style="margin-top:24px;border-top:1px solid #ddd;padding-top:18px;">
            <p style="margin:7px 0;text-align:right;">Subtotal: ${escapeHtml(
              formatMoney(order.subtotal)
            )}</p>
            <p style="margin:7px 0;text-align:right;">Delivery: ${escapeHtml(
              formatMoney(order.deliveryFee)
            )}</p>
            <p style="margin:10px 0 0;text-align:right;font-size:22px;"><strong>${escapeHtml(
              formatMoney(order.total)
            )}</strong></p>
            <p style="margin:8px 0 0;text-align:right;color:#666;font-size:13px;">Cash on delivery</p>
          </div>

          <a href="${escapeHtml(
            getAdminOrdersUrl()
          )}" style="display:block;margin-top:28px;background:#111;color:#fff;padding:15px 18px;text-align:center;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Open admin orders</a>
        </div>
      </div>
    </body>
  </html>`;
}

export async function sendNewOrderNotification(
  order: NewOrderNotification
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.warn(
      `New-order email skipped for order #${order.orderId}: RESEND_API_KEY is not configured.`
    );
    return;
  }

  const recipient =
    process.env.ORDER_NOTIFICATION_EMAIL?.trim() ||
    defaultNotificationEmail;
  const sender =
    process.env.ORDER_NOTIFICATION_FROM?.trim() || defaultSender;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `strip-new-order-${order.orderId}`,
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: `New STRIP order #${order.orderId} · ${formatMoney(
          order.total
        )}`,
        html: createHtmlEmail(order),
        text: createTextEmail(order),
        tags: [
          { name: "type", value: "new_order" },
          { name: "order_id", value: String(order.orderId) },
        ],
      }),
    });

    if (!response.ok) {
      const details = (await response.text()).slice(0, 500);
      console.error(
        `New-order email failed for order #${order.orderId} (${response.status}):`,
        details
      );
    }
  } catch (error) {
    console.error(
      `New-order email request failed for order #${order.orderId}:`,
      error
    );
  }
}
