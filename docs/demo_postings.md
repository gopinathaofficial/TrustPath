# Demo postings

Paste these in the Detect page. Results shown are from rules only (no OpenRouter key); with a key the agent adds signals, a trail of tool calls, and a drafted message.

## 1. Fake (expected: Likely Fake, score 0)
- Title: Work From Home Data Entry
- Company: Amazon Careers
- Source: WhatsApp
- Recruiter: `amazon.hr.jobs@gmail.com`
- Description:
  > Urgent! Work from home, earn Rs 5000/day, no experience needed. Pay Rs 2500 registration fee to confirm your slot. Contact HR on WhatsApp. Send Aadhaar and PAN to confirm.

## 2. Suspicious (expected: Suspicious, score 70)
- Title: Customer Success Associate
- Company: BrightPath Solutions
- Source: LinkedIn
- Recruiter: `hr.brightpath@gmail.com`
- Description:
  > We are looking for a customer success associate for our growing team. Good salary and flexible hours. Interested candidates should send their CV and we will schedule a quick chat.

## 3. Real (expected: Real Job, score 100)
- Title: Backend Engineer
- Company: IBM
- Source: Company Website
- Recruiter: `talent@ibm.com`
- Description:
  > Backend engineer role in Bengaluru. You will build Python services, review code, and collaborate with product. Requirements: 3+ years of Python and SQL. Apply via the careers page. Salary 18-25 LPA with standard benefits and health insurance for the whole family included in the package.

## 4. Lookalike domain (bonus)
- Company: Stripe, Recruiter: `hr@careers-stripe.com`, any normal description. Expected: recruiter check fails (domain imitates a known company).
