# Email Threat Protection Dashboard

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A modern, production-ready React dashboard for monitoring and analysing email security threats. Features real-time search, advanced filters, paginated threat feeds, and a visual statistics overview — all powered by mock data out of the box, with a clean API integration path.

## Features

- **📧 Email List View** - Display emails with comprehensive threat information
- **🔍 Real-time Search** - Search across subject, sender, threat type, classifier, and taxonomy
- **🎨 Color-coded Taxonomy** - Visual threat level indicators
- **🔽 Advanced Filters** - Filter by threat type, classifier, and taxonomy
- **📄 Pagination** - Navigate through emails with page controls
- **📏 Configurable Page Size** - View 10, 20, or 50 emails per page
- **📝 Detailed Email View** - Click any email for full details
- **📊 Statistics** - Real-time threat and clean email counts
- **🔄 Refresh** - Fetch latest data on demand
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React** 18.3.1
- **Tailwind CSS** 3.x
- **Lucide React** 0.263.1
- **React Scripts** 5.0.1

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/email-threat-dashboard.git
cd email-threat-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Tailwind CSS

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
```

### 4. Configure `tailwind.config.js`

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### 5. Update `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Start the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── App.jsx                        # Main application component
├── index.js                       # Entry point
├── index.css                      # Global styles with Tailwind
├── App.css                        # App-level styles
├── components/
│   ├── EmailDetailModal.jsx       # Email detail modal
│   ├── EmailListItem.jsx          # Individual email list item
│   ├── Pagination.jsx             # Pagination controls
│   └── StatisticsFooter.jsx      # Statistics footer
├── utils/
│   ├── helpers.js                 # Utility functions
│   └── uiStates.jsx              # UI state components
└── data/
    └── mockData.js                # Mock email data (25 emails)
```

## 🔌 API Configuration

### Using Mock Data (Default)

The app runs with mock data out of the box. Set in `App.jsx`:

```javascript
const USE_MOCK_DATA = true;
```

### Using Real API

1. Set `USE_MOCK_DATA = false` in `App.jsx`
2. Create a `.env` file in root:

```bash
REACT_APP_API_URL=http://your-api-url.com
```

### Expected API Format

**List Endpoint:** `GET /api/threats/?page=1&page_size=10`

```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "threat_id": 1001,
      "threat_type": "SP",
      "classifier": "content_intent_attack",
      "taxonomy": "spam",
      "subject": "Email subject",
      "body": "Email body content",
      "sender_domain": "example.com",
      "internet_message_id": "msg001@example.com",
      "score": 0.95,
      "imported_at": "2024-12-02T11:33:17.029000Z",
      "created_on": "2024-12-04T10:30:00.000000Z"
    }
  ]
}
```

**Detail Endpoint:** `GET /api/threats/{id}/`

Response: Single email object (same structure as above)

**Filter Query Parameters:**
```
?threat_type__contains=SP
?classifier__contains=content_intent
?taxonomy__contains=spam
?page=1&page_size=10
```

## 🎨 Color Coding

| Taxonomy | Color |
|----------|-------|
| businessEmailSpoofing | 🔴 Red |
| phishing | 🔴 Red |
| spam | 🟠 Orange |
| malware | 🟣 Purple |
| businessEmailImpersonation | 🟡 Yellow |
| legitimate | 🟢 Green |

## 📊 Threat Types

| Code | Description |
|------|-------------|
| SP | Spam |
| PH | Phishing |
| MA | Malware |
| IM | Impersonation |
| CL | Clean |

## 🔽 Filtering

The dashboard supports filtering by:

- **Threat Type** - SP, PH, MA, IM, CL
- **Classifier** - content_intent_attack, credential_harvesting, etc.
- **Taxonomy** - spam, phishing, malware, etc.

Filters use `contains` matching, supporting partial input.

## 📜 Available Scripts

```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
```

## 🚀 Deployment

### Netlify (Easiest)
```bash
npm run build
# Drag and drop build/ folder to netlify.com/drop
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### AWS S3
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name --acl public-read
```

## 🐛 Troubleshooting

**App not loading:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

**Tailwind styles not working:**
- Check `tailwind.config.js` content paths
- Ensure `@tailwind` directives are in `index.css`

**API not connecting:**
- Set `REACT_APP_API_URL` in `.env`
- Ensure CORS is enabled on your backend
- Check browser Network tab for error details

## 🤝 Contributing

1. Fork the repository
2. Create your branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request



Built using React and Tailwind CSS