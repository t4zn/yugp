# AI Learning Ecosystem - Interactive 3D Chat Interface

A cutting-edge AI-powered chat interface featuring immersive 3D animations and multi-modal capabilities, built for Drapels' AI learning ecosystem.

## 🌟 Features

### 🤖 Advanced AI Chat System
- **Multi-Model Support**: Integration with multiple state-of-the-art language models including:
  - OpenAI GPT-OSS 120B
  - Kimi K2 Instruct
  - Meta Llama 4 Scout & Maverick (17B parameters)
  - DeepSeek R1 Distill (70B with reasoning capabilities)
  - Llama 3.3 70B Versatile

- **Vision Capabilities**: Upload and analyze images with AI models that support visual understanding
- **Smart Model Switching**: Automatically switches to vision-enabled models when images are uploaded
- **Real-time Streaming**: Live message streaming for instant AI responses

### 🎨 AI Image Generation
- **Multiple Image Models**:
  - FLUX.1 Schnell - High-quality, fast image generation
  - Stable Diffusion XL - Advanced diffusion model for detailed images
- **Custom Prompt Interface**: Intuitive input system for image generation
- **Real-time Preview**: Live image generation with progress indicators
- **High Resolution Output**: Generate images up to 1024x1024 pixels

### 🎯 Interactive 3D Robot Animation
- **Spline 3D Integration**: Immersive 3D robot character rendered using Spline
- **Mouse Interaction**: Advanced mouse tracking and interaction with the 3D robot
- **Real-time Responsiveness**: Smooth animations that respond to user interactions
- **Background Integration**: Seamlessly integrated 3D background that doesn't interfere with UI elements

### 🖱️ Advanced Interaction System
- **Selective Pointer Events**: Smart layer system that allows UI interaction while preserving 3D background interactivity
- **Touch-Friendly**: Optimized for both desktop and mobile interactions
- **Smooth Transitions**: Fluid animations and state transitions throughout the interface

### 📱 Responsive Design
- **Mobile-Optimized**: Fully responsive design that works seamlessly across all devices
- **Touch Gestures**: Native touch support for mobile interactions with the 3D environment
- **Adaptive Layout**: Dynamic layout that adjusts to different screen sizes and orientations

### 🎛️ User Experience Features
- **Suggested Prompts**: Quick-start buttons with common AI queries
- **Error Handling**: Comprehensive error management with user-friendly notifications
- **Loading States**: Beautiful loading animations and progress indicators
- **Image Upload**: Drag-and-drop image upload with preview functionality
- **Toast Notifications**: Contextual feedback system using Sonner

## 🛠️ Technical Architecture

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions

### 3D Graphics & Animation
- **Spline** - 3D scene creation and rendering
- **@splinetool/react-spline** - React integration for Spline scenes
- **Custom Interaction Hooks** - Advanced mouse and touch interaction handling

### AI Integration
- **Vercel AI SDK** - Seamless AI model integration
- **Groq API** - High-performance AI model access
- **Hugging Face Inference** - Image generation capabilities
- **Streaming Responses** - Real-time AI message streaming

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon system
- **React Markdown** - Rich text message rendering
- **Custom Component Library** - Tailored UI components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Groq API key
- Hugging Face token (for image generation)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd ai-sdk-starter-groq-9
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
HF_TOKEN=your_hugging_face_token_here
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Use

### Chat Interface
1. **Text Chat**: Type your message in the input field and press Enter
2. **Image Upload**: Click the image icon to upload photos for AI analysis
3. **Model Selection**: Choose from different AI models based on your needs
4. **Suggested Prompts**: Click on suggested prompts to get started quickly

### Image Generation
1. **Switch Mode**: Select an image generation model from the dropdown
2. **Enter Prompt**: Describe the image you want to generate
3. **Generate**: Click "Generate" or press Enter to create your image
4. **Download**: Right-click on generated images to save them

### 3D Interaction
1. **Mouse Movement**: Move your mouse over the 3D robot to see interactive responses
2. **Click Interactions**: Click on different parts of the robot for animations
3. **Touch Support**: On mobile, touch and swipe to interact with the 3D scene

## 🎨 3D Animation Details

### Robot Character
- **Custom 3D Model**: Professionally designed robot character created in Spline
- **Interactive Elements**: Multiple interaction points with unique animations
- **Smooth Performance**: Optimized for 60fps performance across devices
- **Dynamic Lighting**: Real-time lighting effects that respond to interactions

### Animation System
- **Mouse Tracking**: Precise cursor following and interaction detection
- **State Management**: Smart animation state handling to prevent conflicts
- **Performance Optimization**: Efficient rendering with minimal resource usage
- **Cross-Platform**: Consistent experience across desktop and mobile

## 🔧 Customization

### Adding New AI Models
Edit `ai/providers.ts` to add new language models or modify existing ones.

### Customizing the 3D Scene
Replace `nexbot_robot_character_concept.spline` in the public folder with your own Spline scene.

### Styling Changes
Modify the Tailwind configuration in `tailwind.config.js` or update component styles directly.

## 📊 Performance Features

- **Code Splitting**: Dynamic imports for optimal bundle sizes
- **SSR Optimization**: Server-side rendering for faster initial loads
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Intelligent caching strategies for AI responses
- **Background Processing**: Non-blocking AI operations

## 🌐 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with zero configuration

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is part of the Drapels AI learning ecosystem. All rights reserved.

## 🙏 Acknowledgments

- **Spline** for the amazing 3D animation capabilities
- **Vercel** for the AI SDK and deployment platform  
- **Groq** for high-performance AI model access
- **Hugging Face** for image generation models

---

Built with ❤️ for the future of AI-powered learning experiences.
