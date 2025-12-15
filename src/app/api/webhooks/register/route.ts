import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1449373893528784946/OGjYLBAPSx4wE-S4lkkSwz2erbzwvYspwM0P_1iVUprUPRKMyz499E7vWK6-tUH9Nwot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, displayName, uid, method } = body;

    if (!email || !displayName || !uid || !method) {
      return NextResponse.json(
        { error: 'Missing required fields: email, displayName, uid, method' },
        { status: 400 }
      );
    }

    const embed = {
      title: "🚀 New User Registered!",
      color: 5763719, // Green
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: "📧 Email",
          value: email,
          inline: true
        },
        {
          name: "👤 Name",
          value: displayName,
          inline: true
        },
        {
          name: "🆔 User ID",
          value: uid,
          inline: false
        },
        {
          name: "🔐 Method",
          value: method === 'google' ? 'Google' : 'Email',
          inline: true
        }
      ],
      footer: {
        text: "Dramaflex Registration System"
      }
    };

    const discordPayload = {
      embeds: [embed]
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to send Discord notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'User registration logged to Discord' });

  } catch (error) {
    console.error('Error in Discord webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}