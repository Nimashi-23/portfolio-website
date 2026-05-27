# EmailJS Template Fix

## The Problem
Your EmailJS template variables don't match what the code is sending. 

## Current Code Variables Being Sent:
```javascript
{
  to_email: 'nimashisankhapala@gmail.com',
  from_name: 'User Name',
  from_email: 'user@example.com',
  message: 'User Message',
  reply_to: 'user@example.com'
}
```

## What Your Template Should Look Like

**In EmailJS Dashboard:**

1. Go to **Email Templates**
2. Find your template: `template_pmkdgte`
3. **Edit the Email Body** to:

```
Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}
```

4. **Email To field** should be: `{{to_email}}`
5. **Subject** should be: `New message from {{from_name}}`
6. **Save**

## Alternative: Simple Template

If you want even simpler:

**Subject:**
```
New Portfolio Message
```

**Body:**
```
Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}
```

**To Email:**
```
{{to_email}}
```

## Test It Again
After updating your template:
1. Go to your portfolio contact form
2. Fill it in and submit
3. Check if you receive the email

---

## If Still Not Working:

**Check the browser console:**
1. Open your website
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try sending the form again
5. Look for error messages
6. Share the error messages if any

**Most Common Issues:**
- ❌ Template variable names don't match (the `{{variable}}` names)
- ❌ Gmail service is not authorized in EmailJS
- ❌ Public Key/Service ID/Template ID are wrong
- ❌ Email service is not connected in EmailJS dashboard
