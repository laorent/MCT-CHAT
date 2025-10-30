# MCT Chat

This is a responsive, streaming chat application built with Next.js and powered by Google's Gemini model. It supports contextual conversations, image analysis, and real-time web search capabilities.

![MCT Chat Screenshot](https://picsum.photos/seed/mct-chat-app/1200/800)

## ✨ Features

- **Streaming Chat**: Real-time responses from the Gemini model for a fluid conversation.
- **Contextual Memory**: The chat remembers previous messages in the session for coherent, long-form conversations.
- **Image Analysis**: Upload images and ask questions about them, leveraging Gemini's multimodal capabilities.
- **Web-Powered Answers**: The model can search the web to provide answers on recent events and topics, with citations included in the response.
- **Responsive UI**: A clean and modern user interface that works seamlessly across desktop, tablet, and mobile devices.
- **Session Reset**: A "Clear Session" button to instantly reset the conversation.
- **Secure**: API keys are securely managed on the server-side and are not exposed to the client.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [pnpm](https://pnpm.io/installation) (or npm/yarn)
- A Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of your project and add your Gemini API key:

```
GEMINI_API_KEY="your-gemini-api-key"
```

You can also specify a different Gemini model by adding `GEMINI_MODEL` to your `.env.local` file. The default is `gemini-2.5-flash`.

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## 部署 (Deployment)

This application is optimized for deployment on [Vercel](https://vercel.com/).

### Deploy with Vercel

1.  **Push to GitHub/GitLab/Bitbucket**: Push your code to a Git repository.
2.  **Import Project**: In your Vercel dashboard, import the project from your Git repository.
3.  **Configure Environment Variables**: Vercel will automatically detect that you're using Next.js. Go to the "Environment Variables" section in your project settings and add your `GEMINI_API_KEY`. It's recommended to use Vercel's secret management for this.
4.  **Deploy**: Click the "Deploy" button. Vercel will build and deploy your application. Once done, you'll get a URL to your live site.

The included `vercel.json` file configures the serverless function to have a longer execution time, which is recommended for AI applications.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) – React Framework
- [Google Gemini API](https://ai.google.dev/docs/gemini_api_overview) – AI Model
- [Tailwind CSS](https://tailwindcss.com/) – CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) – UI Components
- [TypeScript](https://www.typescriptlang.org/) – Language

## File Tree

```
.
├── README.md
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── api
│   │   │   └── chat
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── chat
│   │   │   ├── chat-form.tsx
│   │   │   ├── chat-list.tsx
│   │   │   ├── chat-message.tsx
│   │   │   └── chat.tsx
│   │   └── ui
│   │       ├── ... (shadcn components)
│   ├── lib
│   │   ├── types.ts
│   │   └── utils.ts
│   └── ...
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```
