# Master Prompt: Create a Professional GitHub README for HustleMate AI

Act as a professional technical writer, GitHub repository architect, and open-source project documentation expert.

Create a complete, polished, and developer-friendly `README.md` for my project **HustleMate AI**.

## Project Overview

**Project Name:** HustleMate AI  
**Tagline:** Your AI-Powered Side Hustle Assistant  
**Challenge:** Side Hustle — Build something with open-source AI at its core.

HustleMate AI is a lightweight web application designed to help freelancers, students, creators, and small-business owners manage everyday business tasks from one dashboard.

It uses HTML, CSS, and JavaScript for the frontend and integrates an open-source AI model through Hugging Face Transformers.js for AI-assisted product listing generation.

## Core Features

1. **AI Listing Writer**
   - Generate product descriptions for online selling.
   - Customize the target audience, tone, product details, and selling platform.
   - Copy or download generated listings.
   - Use a fallback template if the AI model is unavailable.

2. **Invoice Maker**
   - Enter business and client information.
   - Add invoice details, quantities, rates, and notes.
   - Generate a printable invoice.
   - Save the invoice as a PDF through the browser’s print dialog.

3. **Profit Calculator**
   - Calculate profit per unit.
   - Calculate profit margin.
   - Estimate monthly profit using expected sales volume.
   - Display a simple business insight based on the entered values.

4. **Responsive Dashboard**
   - Modern SaaS-style interface.
   - Forest-green and lime-accented design.
   - Responsive layout for desktop and mobile.
   - Navigation between application tools.

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Hugging Face Transformers.js
- `Xenova/flan-t5-small` model
- Browser Print API for printable invoices

Clearly explain which technologies handle the interface, application logic, AI inference, and invoice printing.

## Open-Source AI and Innovation

Include a dedicated section explaining why open innovation matters.

Explain how an open-weight model and Transformers.js can make AI experimentation more accessible, allow developers to inspect and adapt the implementation, and reduce dependence on proprietary AI APIs.

Be technically accurate: do not claim that the application runs entirely offline unless this has been tested. Explain that the library and model may need to download from a CDN or model host, and browser compatibility and available memory can affect performance.

Do not claim that the model is fine-tuned or trained by this project. Distinguish between using an existing open-weight model and training a new model.

## README Structure

Organize the README in this order:

1. Project title and tagline
2. Short project introduction
3. Problem statement
4. Solution
5. Features
6. Demo and screenshots section with clearly marked placeholders
7. Technology stack
8. How the AI works
9. Why open innovation matters
10. Project folder structure
11. Installation and setup instructions
12. How to run locally
13. How to use each feature
14. Deployment instructions for GitHub Pages or Vercel static hosting
15. Limitations and future improvements
16. Privacy and responsible use
17. Contributing guidelines
18. License
19. Acknowledgements

## Installation Instructions

Document a simple setup process:

1. Clone the repository.
2. Open the project folder.
3. Confirm that `index.html`, `style.css`, and `script.js` are present.
4. Run the application with a local development server, such as the VS Code Live Server extension.
5. Open the local URL in a browser.
6. Explain that a local server is recommended for consistent module loading and model downloads.

Include the appropriate Git commands in code blocks, but use placeholders for the repository URL if it has not been provided.

## Folder Structure

Use this structure only if it matches the actual repository:

```text
hustlemate-ai/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Deployment

Explain how to deploy the static application using GitHub Pages or Vercel. Include clear steps, but do not invent a live deployment URL or claim that deployment has already occurred.

## Future Improvements

Suggest realistic enhancements, such as:
- More product-listing templates and supported languages.
- Improved model loading feedback and error handling.
- Exporting invoices with improved formatting.
- Saving business data locally with user consent.
- More detailed profit analysis.
- Optional integration with additional open-source models.

Clearly label these as future ideas, not completed features.

## Writing and Formatting Requirements

- Use professional Markdown.
- Add a table of contents if it improves navigation.
- Use concise explanations, readable tables, bullet lists, and code blocks.
- Include suitable GitHub badges only when their values are accurate.
- Keep the tone suitable for a hackathon submission and an open-source GitHub portfolio.
- Explain the project in beginner-friendly language without making it sound unprofessional.
- Do not invent screenshots, test results, user counts, performance metrics, contributors, license details, or deployment links.
- Do not claim that all features are AI-powered: the invoice maker and profit calculator use application logic rather than the language model.
- Do not claim that the AI output is always correct; recommend reviewing generated descriptions before publishing.
- If a license has not been chosen, mark it as a decision to make rather than declaring the project open-source under an unspecified license.

## Final Deliverable

Return the complete `README.md` content in one Markdown document that I can copy directly into my GitHub repository. Include a compelling opening that makes the project understandable within the first few seconds and clearly communicates its value for the Side Hustle challenge.