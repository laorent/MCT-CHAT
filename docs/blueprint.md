# **App Name**: Gemini Chat

## Core Features:

- Streaming Chat: Enables real-time, streaming responses from the Gemini model, enhancing user experience through immediate feedback.
- Contextual Memory: Maintains chat history for coherent conversations, managing long contexts efficiently.
- Image Analysis: Allows users to upload images, which Gemini analyzes to provide multimodal responses.
- Web Tool: Empowers Gemini to fetch and integrate real-time web data via tool use. The app ensures the reference to all online tools is presented to the user in an inline manner.
- Responsive UI: Offers a seamless chat experience across desktop, tablet, and mobile devices.
- Session Reset: Adds a 'one-click' button to clear the chat history and reset the session.
- API Key Security: Securely manages the Gemini API key through environment variables, preventing exposure in the codebase. All references to external URLs should be handled in an inline manner with proper descriptions.

## Style Guidelines:

- Primary color: Soft blue (#A0D2EB) for a calm and approachable feel.
- Background color: Light gray (#F5F5F5), providing a clean and neutral backdrop.
- Accent color: Muted purple (#B39DDB) to highlight interactive elements and important information.
- Body and headline font: 'Inter', a sans-serif font offering excellent readability and a modern aesthetic.
- Code font: 'Source Code Pro' for clear display of code snippets.
- Use minimalist, consistent icons to represent actions and functionalities within the chat interface.
- Implement a fluid grid layout using Tailwind CSS for responsiveness and adaptability across various screen sizes.
- Incorporate subtle animations for message delivery and UI transitions to enhance user engagement without being distracting.