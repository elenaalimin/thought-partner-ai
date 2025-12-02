# Thought Partner AI

A modern web application for solo founders seeking AI-powered guidance and support through their building journey.

## Features

- 🤖 **AI-Powered Chat**: Intelligent conversations with Claude AI, trained on founder wisdom
- 🎯 **Context-Aware**: Remembers your background, stage, and project context
- 🧠 **Multiple Modes**: Brainstorming, Challenge Mode, Strategic Advisor, Technical Guide
- 💬 **Conversation History**: Persistent chat history with Supabase
- 📝 **Onboarding Flow**: Multi-step setup to personalize your experience
- 🔒 **Secure Authentication**: Supabase Auth integration

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend/Database**: Supabase (Auth, PostgreSQL, Storage)
- **AI Integration**: Anthropic Claude API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- An Anthropic API key

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)
- `ANTHROPIC_API_KEY` - Your Anthropic Claude API key

3. **Set up Supabase database:**

Run the migration file in your Supabase SQL editor:

```bash
# The migration file is located at:
supabase/migrations/20240101000000_initial_schema.sql
```

Copy the contents of this file and run it in your Supabase SQL editor to create all necessary tables, indexes, and RLS policies.

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/thought-partner-ai
├── /src
│   ├── /app
│   │   ├── /api          # API routes
│   │   ├── /auth         # Authentication pages
│   │   ├── /onboarding   # Onboarding flow
│   │   ├── /chat         # Main chat interface
│   │   └── layout.tsx    # Root layout
│   ├── /components
│   │   └── /ui           # shadcn/ui components
│   ├── /lib
│   │   ├── supabase.ts   # Supabase client setup
│   │   ├── claude.ts     # Claude API integration
│   │   └── utils.ts      # Utility functions
│   └── /types            # TypeScript type definitions
├── /supabase
│   └── /migrations       # Database migrations
└── package.json
```

## Database Schema

The application uses the following main tables:

- **profiles**: User profile information (field of study, solo founder status, idea stage, context)
- **conversations**: Chat conversation metadata
- **messages**: Individual messages in conversations
- **decisions**: Decision tracking (future feature)
- **learning_resources**: Curated learning content (future feature)

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## AI System Prompt

The AI is configured with a sophisticated system prompt that:

- Acts as a "critical friend" - supportive but challenging
- References YC Startup School content and founder wisdom
- Asks probing questions rather than just agreeing
- Maintains context awareness from user profile
- Adapts based on selected mode (Brainstorming, Challenge, Strategic, Technical)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The app will automatically deploy on every push to your main branch.

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`

## Future Features

- 🎤 Voice Banter: Web Speech API integration for voice conversations
- 🌳 Decision Tree Tool: Visual decision framework with pros/cons analysis
- 📚 Learning Library: Curated startup/business concepts and resources
- 🎙️ Podcast Mode: NotebookLM-style deep dives on user projects

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.


