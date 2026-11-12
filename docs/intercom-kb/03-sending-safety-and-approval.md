# Sending safety and approval

**Nothing sends without your approval.** Every run starts as a dry run. Live sends need approval in the dashboard.

## What is in place before and during sending

- Dedicated sending domains with SPF, DKIM and DMARC published before the first send.
- Volume ramped gradually, with the opening batch reviewed. The ramp is held if any signal degrades.
- Addresses verified before they can be sent to.
- A person reads every email before it sends, and any claim without a source is dropped.
- Anyone who replies leaves the sequence at once.
- One-click unsubscribe on every message.
- Opt-outs are suppressed permanently, across every sending domain.
- If complaints rise, sending pauses itself.

## What is monitored

Each day SlideIn reads what was delivered, bounced, flagged or answered: replies, positive replies, bounces and complaints. There is no open tracking. Clients pre-fetch tracking pixels, so open rates count machines, and the pixel can hurt delivery.
