# 🛡️ Security Policy

## Supported Versions

The following table lists which versions of the **Lifestyle Scoring and Chronic Disease Risk Analysis System** are actively supported with security updates:

| Version | Supported          |
| -------- | ------------------ |
| 1.0.x (Final FYP Release) | :white_check_mark: |
| 0.9.x (Beta)               | :x:                |
| < 0.9                      | :x:                |

> Only the **final release (v1.0.x)** will continue to receive maintenance and security patches during the project evaluation period.

---

## Reporting a Vulnerability

If you discover a security vulnerability in this system (such as data leakage, weak authentication, or API misuse), please follow the procedure below:

1. **Contact the Developer:**  
   Report vulnerabilities directly to the project developer via email:  
   📧 **[soonyongsham@gmail.com]**

2. **Include Details:**  
   Please provide the following information:
   - Description of the vulnerability (how it was found and what impact it has)  
   - Steps to reproduce the issue  
   - Affected module or endpoint (e.g., `/api/predict`, `/auth/login`)  
   - Possible mitigation or fix suggestion (if any)

3. **Response Timeline:**  
   You can expect:
   - **Acknowledgement:** within **2 business days**  
   - **Initial assessment:** within **5 business days**  
   - **Fix release (if valid):** within **10–15 business days**

4. **Responsible Disclosure:**  
   Please **do not publicly disclose** the vulnerability until a fix has been confirmed and deployed. This helps protect other users’ data.

---

## Security Practices

To maintain a secure environment, this project implements the following measures:
- 🔐 **Firebase Authentication** for secure user login and identity management.  
- 🔒 **HTTPS (SSL/TLS)** communication between the mobile app and backend API.  
- 🧩 **Input validation and sanitization** on all user inputs.  
- 📁 **Minimal data retention policy** — only necessary lifestyle data are stored.  
- 🧠 **Data anonymization** in ML processing and report generation.  

---

## Future Improvements

Planned security enhancements include:
- Implementation of **Role-Based Access Control (RBAC)**.  
- Periodic **security audits** of the FastAPI backend and Firebase integration.  
- Integration of **encryption at rest** for sensitive user data stored in Firebase or SQLite.

---

© 2025 Lifestyle Scoring and Chronic Disease Risk Analysis System  
Developed as part of Final Year Project (FYP) — INTI International University
