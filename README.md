# TaskTide - Emotionally Intelligent Task Management

<div align="center">
  <img src="public/placeholder.svg" alt="TaskTide Logo" width="120" height="120">
  
  <p><strong>TaskTide helps you manage tasks with emotional intelligence, adapting to your mood and capacity for a more encouraging productivity experience.</strong></p>
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-cyan.svg)](https://tailwindcss.com/)
</div>

## ✨ Features

### 🧠 Emotionally Intelligent Task Management
- **Daily Mood Check-ins**: Start each day by checking in with your emotional state
- **Adaptive Task Prioritization**: Tasks are automatically reordered based on your current mood and energy levels
- **Mood-Specific Messaging**: Receive encouraging messages tailored to how you're feeling

### 📊 Smart Dashboard
- **Personalized Welcome**: Greet users with mood-aware messages and emojis
- **Progress Tracking**: Visual progress bars and completion statistics
- **Streak Counter**: Track consecutive days of productivity
- **Quick Actions**: Easy access to add tasks and view schedules

### ⏰ Task Management
- **Intelligent Task Cards**: Display tasks with difficulty indicators and time estimates
- **Task Timer**: Built-in Pomodoro-style timer for focused work sessions
- **Task Breakdown**: Break complex tasks into manageable subtasks
- **Priority System**: Smart prioritization based on mood and task characteristics

### 🎉 Celebration & Reflection
- **Progress Celebrations**: Celebrate completed tasks with encouraging animations
- **Evening Reflections**: End-of-day reflection prompts for gratitude and planning
- **Mood Tracking**: Compare morning and evening moods to track emotional patterns

### 🎨 Beautiful UI/UX
- **Gradient Backgrounds**: Calming ocean-inspired gradients throughout the app
- **Smooth Animations**: Gentle fade-ins and transitions for a soothing experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Comfortable viewing in any lighting condition

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Routing**: React Router DOM 6.30.1
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Animations**: Tailwind CSS animations with custom transitions
- **Icons**: Lucide React for consistent iconography

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jyotsna-pm/task-tide.git
   cd task-tide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AddTaskModal.tsx # Task creation modal
│   ├── AllTasksView.tsx # Complete task list view
│   ├── EveningReflection.tsx # End-of-day reflection
│   ├── MoodCheckIn.tsx  # Morning mood check-in
│   ├── TaskCard.tsx     # Individual task component
│   ├── TaskDashboard.tsx # Main dashboard
│   └── TaskTimer.tsx    # Pomodoro timer
├── pages/               # Main application pages
│   ├── Index.tsx        # Main app container
│   ├── LandingPage.tsx  # Welcome/landing page
│   └── OnboardingFlow.tsx # User onboarding
├── data/                # Mock data and types
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── assets/              # Static assets
```

## 🎯 Core Concepts

### Mood-Adaptive Task Management

TaskTide's core innovation is its ability to adapt to your emotional state:

- **Low Mood (1-2)**: Prioritizes easy, quick tasks to build momentum
- **Neutral Mood (3)**: Balanced approach with standard prioritization
- **High Mood (4-5)**: Encourages tackling challenging, high-impact tasks

### Daily Workflow

1. **Morning Check-in**: Rate your mood and energy (1-5 scale)
2. **Adaptive Dashboard**: View tasks prioritized for your current state
3. **Focused Work**: Use the built-in timer for focused work sessions
4. **Progress Tracking**: Watch your completion rate and maintain streaks
5. **Evening Reflection**: Reflect on accomplishments and plan tomorrow

## 🎨 Design System

TaskTide uses a carefully crafted design system with:

- **Ocean-inspired Colors**: Calming blues and teals promote focus
- **Encouraging Interactions**: Positive reinforcement through micro-animations
- **Gentle Transitions**: Smooth animations reduce cognitive load
- **Accessible Typography**: Clear hierarchy and readable fonts

## 📱 Responsive Design

- **Mobile-First**: Optimized for touch interactions
- **Tablet Support**: Adaptive layouts for medium screens
- **Desktop Enhancement**: Full feature set on larger displays

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Configure build settings** (auto-detected):
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy**: Automatic deployments on push to main branch

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Environment Configuration

Create a `vercel.json` file for SPA routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **shadcn/ui** for beautiful component designs
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the icon system

## 📞 Support

If you have questions or need help:

- 📧 Email: support@tasktide.app
- 🐛 Issues: [GitHub Issues](https://github.com/jyotsna-pm/task-tide/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/jyotsna-pm/task-tide/discussions)

---

<div align="center">
  <p>Made with ❤️ for a more emotionally intelligent approach to productivity</p>
  <p><strong>TaskTide - Ride the wave of mindful productivity</strong></p>
</div>
