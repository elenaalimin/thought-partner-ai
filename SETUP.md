# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14+
- React & TypeScript
- Supabase client
- OpenAI SDK
- Tailwind CSS
- shadcn/ui dependencies
- And more...

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:

   **Supabase Setup:**
   - Go to https://supabase.com and create a new project
   - In your Supabase project dashboard, go to Settings > API
   - Copy your Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy your anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy your service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

   **OpenAI Setup:**
   - Go to https://platform.openai.com
   - Create an API key
   - Copy it → `OPENAI_API_KEY`

   **Security Configuration (Optional but Recommended):**
   - `CHAT_API_KEY` - Optional API key to protect your chat endpoint (recommended for production)
   - `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 20)
   - `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 60000 = 1 minute)
   - `MAX_MESSAGE_LENGTH` - Maximum message length in characters (default: 5000)
   - `MAX_REQUEST_SIZE` - Maximum request size in bytes (default: 100000 = 100KB)

## Step 3: Set Up Supabase Database

1. In your Supabase project dashboard, go to the SQL Editor
2. Open the migration file: `supabase/migrations/20240101000000_initial_schema.sql`
3. Copy the entire contents of that file
4. Paste it into the Supabase SQL Editor
5. Click "Run" to execute the migration

This will create:
- All necessary tables (profiles, conversations, messages, decisions, learning_resources)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

1. You'll be redirected to `/auth/login`
2. Create a new account (or sign in)
3. Complete the onboarding flow
4. Start chatting with your AI Thought Partner!

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing modules, make sure you've run `npm install`.

### Supabase Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure the migration has been run successfully

### OpenAI API Errors
- Verify your `OPENAI_API_KEY` is correct
- Check your OpenAI account has credits/quota available
- Make sure you're using a valid API key

### Authentication Issues
- Check that Supabase Auth is enabled in your project
- Verify email confirmation settings in Supabase dashboard
- For development, you can disable email confirmation in Supabase Auth settings

## Next Steps

- Customize the system prompt in `src/lib/openai.ts`
- Add more UI components from shadcn/ui as needed
- Implement the voice banter feature
- Build out the decision tree tool
- Create the learning library content

## Deployment

When ready to deploy:

1. Push your code to GitHub
2. Import to Vercel (or your preferred platform)
3. Add all environment variables in the deployment platform
4. Deploy!

Make sure to set all 4 environment variables in your production environment.


