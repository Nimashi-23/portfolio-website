# EmailJS Setup Guide

This portfolio now uses **EmailJS** to send contact form messages directly to your email without opening an email client.

## Steps to Set Up EmailJS:

### 1. Create an EmailJS Account
- Go to https://www.emailjs.com/
- Sign up for a free account
- Verify your email

### 2. Get Your Public Key
- Log in to EmailJS dashboard
- Go to **Account** → **API Keys**
- Copy your **Public Key**
- Replace `YOUR_PUBLIC_KEY` in `assets/js/main.js` with this key

### 3. Create an Email Service
- In EmailJS dashboard, go to **Email Services**
- Click **Create New Service**
- Choose **Gmail** (or your email provider)
- Click **Connect Account** and authorize Gmail
- Copy the **Service ID**
- Replace `service_YOUR_SERVICE_ID` in `assets/js/main.js` with this ID

### 4. Create an Email Template
- In EmailJS dashboard, go to **Email Templates**
- Click **Create New Template**
- Use the following template:

```
From: {{from_name}} ({{from_email}})
Reply-To: {{reply_to}}

Message:
{{message}}
```

- Set **To Email** to: `{{to_email}}`
- Set **Subject** to: `New Portfolio Message from {{from_name}}`
- Copy the **Template ID**
- Replace `template_YOUR_TEMPLATE_ID` in `assets/js/main.js` with this ID

### 5. Test the Form
- Go to your portfolio contact section
- Fill in the form and click "Send Message"
- You should see a "Message Sent!" popup
- Check your email for the message

## Configuration Location

Update these three values in `assets/js/main.js` (around line 182):

```javascript
emailjs.init('YOUR_PUBLIC_KEY');
...
await emailjs.send('service_YOUR_SERVICE_ID', 'template_YOUR_TEMPLATE_ID', {
```

## Free Tier Limits
- EmailJS free tier allows **200 emails per month**
- No credit card required
- Upgrade anytime if you need more emails

## Troubleshooting

**Form not sending?**
- Check browser console (F12) for errors
- Verify Service ID and Template ID are correct
- Ensure EmailJS account is active

**Emails not received?**
- Check spam/junk folder
- Verify email service is connected and authorized
- Check EmailJS dashboard for error logs
