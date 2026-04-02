import { APP_NAME, APP_URL } from './resend'

// ── Shared layout wrapper ───────────────────────────────────────────────────
function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F2;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F2;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#115529,#1A7A3C);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:900;color:#F7C948;letter-spacing:-0.5px;">Jamaica</div>
          <div style="font-size:22px;font-weight:700;color:#ffffff;margin-top:-4px;">Classifieds</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;">Jamaica&apos;s #1 Marketplace</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 0;text-align:center;">
          <p style="font-size:12px;color:#9CA3AF;margin:0;">
            © ${new Date().getFullYear()} ${APP_NAME} · All rights reserved<br>
            <a href="${APP_URL}" style="color:#1A7A3C;text-decoration:none;">${APP_URL.replace('https://', '').replace('http://', '')}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(text: string, url: string, color = '#1A7A3C') {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${url}" style="background:${color};color:#ffffff;padding:12px 28px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;display:inline-block;">
      ${text}
    </a>
  </div>`
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #E5E5E0;margin:24px 0;">`
}

function detail(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px;font-size:13px;color:#6B7280;font-weight:600;background:#F4F4F2;border-radius:4px;width:40%;">${label}</td>
    <td style="padding:8px 12px;font-size:13px;color:#1D2124;font-weight:500;">${value}</td>
  </tr>`
}

// ── Templates ───────────────────────────────────────────────────────────────

export function welcomeEmail(name: string) {
  return layout(`
    <h2 style="font-size:22px;color:#1D2124;margin:0 0 8px;">Welcome to Jamaica Classifieds! 🇯🇲</h2>
    <p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0 0 20px;">
      Hi ${name}, your account is ready. You can now post ads, connect with buyers and sellers, and browse thousands of listings across all 14 parishes.
    </p>

    ${btn('Browse Listings', `${APP_URL}/browse`)}

    ${divider()}

    <p style="font-size:14px;color:#1D2124;font-weight:700;margin:0 0 12px;">Get started in 3 steps:</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:36px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#E8F5ED;color:#1A7A3C;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;text-align:center;line-height:28px;">1</div>
        </td>
        <td style="padding:10px 0 10px 10px;">
          <div style="font-size:14px;font-weight:600;color:#1D2124;">Post your first free ad</div>
          <div style="font-size:13px;color:#6B7280;">Takes less than 2 minutes</div>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:36px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#E8F5ED;color:#1A7A3C;font-weight:700;font-size:13px;text-align:center;line-height:28px;">2</div>
        </td>
        <td style="padding:10px 0 10px 10px;">
          <div style="font-size:14px;font-weight:600;color:#1D2124;">Add photos to your listing</div>
          <div style="font-size:13px;color:#6B7280;">Listings with photos get 5× more views</div>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:36px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#E8F5ED;color:#1A7A3C;font-weight:700;font-size:13px;text-align:center;line-height:28px;">3</div>
        </td>
        <td style="padding:10px 0 10px 10px;">
          <div style="font-size:14px;font-weight:600;color:#1D2124;">Boost with a Premium Ad</div>
          <div style="font-size:13px;color:#6B7280;">Top placement for just J$1,500</div>
        </td>
      </tr>
    </table>

    ${btn('Post a Free Ad', `${APP_URL}/post-ad`)}
  `)
}

export function listingExpiryEmail(
  name: string,
  listing: { id: string; title: string; priceLabel: string | null; parish: string; expiresAt: Date; tier: string }
) {
  const daysLeft  = Math.ceil((listing.expiresAt.getTime() - Date.now()) / 86400000)
  const expiresOn = listing.expiresAt.toLocaleDateString('en-JM', { weekday: 'long', day: 'numeric', month: 'long' })
  const isFree    = listing.tier === 'FREE'

  return layout(`
    <h2 style="font-size:22px;color:#1D2124;margin:0 0 8px;">Your listing expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} ⏳</h2>
    <p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0 0 20px;">
      Hi ${name}, just a heads up — one of your listings is about to expire on <strong>${expiresOn}</strong>. After that it won&apos;t be visible to buyers.
    </p>

    <div style="background:#F4F4F2;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      <div style="background:#1A7A3C;padding:10px 16px;">
        <div style="font-size:13px;font-weight:700;color:#fff;">Listing</div>
      </div>
      <div style="padding:4px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${detail('Title',    listing.title)}
          ${detail('Price',    listing.priceLabel ?? 'Not set')}
          ${detail('Parish',   listing.parish)}
          ${detail('Expires',  expiresOn)}
          ${detail('Tier',     listing.tier)}
        </table>
      </div>
    </div>

    ${btn('View My Listing', `${APP_URL}/listings/${listing.id}`)}

    ${isFree ? `
      ${divider()}
      <div style="background:#FEF3C7;border-radius:10px;padding:16px;text-align:center;">
        <div style="font-size:15px;font-weight:700;color:#92400E;margin-bottom:6px;">⭐ Boost to Premium</div>
        <div style="font-size:13px;color:#92400E;margin-bottom:12px;">Extend to 60 days and get top placement for just J$1,500</div>
        <a href="${APP_URL}/payment/boost/${listing.id}" style="background:#C9961E;color:#fff;padding:10px 24px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;display:inline-block;">
          Boost My Ad
        </a>
      </div>
    ` : ''}
  `)
}

export function listingExpiredEmail(
  name: string,
  listing: { id: string; title: string; parish: string }
) {
  return layout(`
    <h2 style="font-size:22px;color:#1D2124;margin:0 0 8px;">Your listing has expired 📋</h2>
    <p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0 0 20px;">
      Hi ${name}, your listing <strong>&ldquo;${listing.title}&rdquo;</strong> in ${listing.parish} has expired and is no longer visible to buyers.
    </p>
    <p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0 0 20px;">
      If you still have this item available, post a new ad — it only takes 2 minutes and it&apos;s free.
    </p>
    ${btn('Post a New Ad', `${APP_URL}/post-ad`)}
  `)
}

export function newListingConfirmEmail(
  name: string,
  listing: { id: string; title: string; priceLabel: string | null; parish: string; expiresAt: Date; tier: string }
) {
  const expiresOn = listing.expiresAt.toLocaleDateString('en-JM', { day: 'numeric', month: 'long', year: 'numeric' })
  const isPremium = listing.tier === 'PREMIUM'

  return layout(`
    <h2 style="font-size:22px;color:#1D2124;margin:0 0 8px;">Your ad is live! ${isPremium ? '⭐' : '🎉'}</h2>
    <p style="font-size:15px;color:#6B7280;line-height:1.6;margin:0 0 20px;">
      Hi ${name}, your listing is now live on Jamaica Classifieds and visible to buyers across all 14 parishes.
    </p>

    <div style="background:#F4F4F2;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      <div style="background:${isPremium ? '#C9961E' : '#1A7A3C'};padding:10px 16px;">
        <div style="font-size:13px;font-weight:700;color:#fff;">${isPremium ? '⭐ Premium Listing' : 'Free Listing'}</div>
      </div>
      <div style="padding:4px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${detail('Title',   listing.title)}
          ${detail('Price',   listing.priceLabel ?? 'Not set')}
          ${detail('Parish',  listing.parish)}
          ${detail('Expires', expiresOn)}
        </table>
      </div>
    </div>

    ${btn('View Your Listing', `${APP_URL}/listings/${listing.id}`)}

    ${!isPremium ? `
      ${divider()}
      <p style="font-size:13px;color:#6B7280;text-align:center;margin:0;">
        Want more views? <a href="${APP_URL}/payment/boost/${listing.id}" style="color:#C9961E;font-weight:700;text-decoration:none;">Boost to Premium for J$1,500 →</a>
      </p>
    ` : ''}
  `)
}
