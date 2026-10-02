# Optional integration contract

Default mode has no backend calls. Setting `VITE_API_BASE=https://YOUR-API.example/api` opts in to **your own** endpoints. The adapters below are a proposed contract for this reconstruction, not a claim about the original site's private server.

## POST /contact

```json
{
  "name": "Example",
  "email": "student@example.com",
  "phone": "",
  "subject": "Course question",
  "message": "Please share details."
}
```

A successful HTTP 2xx response shows acknowledgement. Return an error status for rejection. Validate lengths and email server-side, use rate limiting, and configure CORS for your frontend origin.

## POST /registrations

```json
{
  "courseSlug": "digital-dentistry-foundations",
  "fullName": "Example",
  "email": "student@example.com",
  "phone": "+964...",
  "city": "Baghdad",
  "occupation": "Dentist",
  "experience": "2",
  "notes": ""
}
```

2xx acknowledges a registration request only. It does not mean a seat is reserved or a payment is completed. Validate course availability, capacity and user data on the server. Never trust client-side prices or eligibility.

## POST /chat

Request:

```json
{ "message": "What courses are available?", "locale": "en" }
```

Response:

```json
{ "answer": "The response text to display." }
```

Keep provider API keys on the server. Responses render as text, not raw HTML. Apply rate limits, input limits and data-handling rules appropriate to your production service.

## Payments

The payment pages currently have **no gateway integration**. `?demo=1` shows a labelled visual preview only. To implement real payments:

1. Create an order server-side using a server-owned course price.
2. Create checkout with your chosen payment provider.
3. Receive and verify the provider's signed webhook.
4. Store the verified transaction state with idempotency protection.
5. Expose an authorized, minimal order status endpoint.
6. Update the payment page to fetch this status; do not trust URL state.

## Content and admin

Content arrays are local. No CMS, admin UI, database schema, student account system or authentication was observable in the public route table or implemented here. Replace `src/data.js` with a data-fetching layer when your own backend is ready.
