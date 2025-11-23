import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";

export const dynamic = "force-dynamic";

type HelpArticlePageProps = {
  params: { slug: string };
};

// Static help article content
const helpArticles: Record<string, { title: string; content: string; category: string }> = {
  "create-first-habit": {
    title: "How to create your first habit",
    category: "Getting Started",
    content: `
# Creating Your First Habit

Getting started with Habitio is easy! Follow these steps to create your first habit:

## Step 1: Navigate to Habits
Click on "Habits" in the sidebar or tap the "New Habit" button on your dashboard.

## Step 2: Choose a Habit
Think about what you want to build. Good starter habits include:
- Morning meditation (5-10 minutes)
- Reading (20 pages per day)
- Exercise (20 minutes)
- Journaling (5 minutes)

## Step 3: Set Your Target
Decide how many days per week you want to complete this habit. We recommend starting with 5 days per week to give yourself some flexibility.

## Step 4: Add to a Squad (Optional)
Join a squad to get accountability from others working on similar goals.

## Tips for Success
- Start small: It's better to build consistency with a small habit than to burn out on a big one
- Be specific: "Read 20 pages" is better than "Read more"
- Track daily: Check in even when you miss a day to stay aware of your progress
    `,
  },
  "streaks-freezes": {
    title: "Understanding streaks and freezes",
    category: "Habits & Streaks",
    content: `
# Streaks and Freezes Explained

## What is a Streak?
A streak is the number of consecutive days you've completed your habit. Streaks are a powerful motivator—the longer your streak, the more you'll want to maintain it!

## How Streaks Work
- Complete your habit for the day → Streak continues
- Miss a day → Streak resets to 0
- Use a freeze → Streak is protected for that day

## What are Freezes?
Freezes let you take planned breaks without losing your streak. Life happens—you might get sick, travel, or just need a rest day.

## How to Use Freezes
1. Go to your habit settings
2. Tap "Use Freeze" before midnight on the day you need it
3. Your streak will be protected

## Earning Freezes
- You start with 2 freezes
- Earn 1 freeze for every 7 days of streak
- Maximum of 5 freezes can be stored

## Pro Tips
- Save freezes for emergencies
- Plan ahead for vacations
- Don't rely on freezes too much—they're meant for exceptions
    `,
  },
  "how-stakes-work": {
    title: "How stakes work",
    category: "Money & Stakes",
    content: `
# How Stakes Work

## What are Stakes?
Stakes are optional money commitments you put on your habits or challenges. They add real consequences to help you stay accountable.

## How It Works
1. **Stake an amount**: Choose how much to put on the line ($5-$100)
2. **Complete your goal**: Hit your target to keep your money
3. **Win or lose**: Meet the goal = keep your stake. Miss it = lose it.

## Where Does Lost Money Go?
- In squad challenges: Winners split the pot from losers
- In solo stakes: Money goes to the platform fee pool
- A small platform fee (typically 7.5%) is taken from all stakes

## Setting Up a Stake
1. When creating a habit or joining a challenge, look for the "Add Stake" option
2. Enter your stake amount
3. Complete payment through our secure checkout
4. Start tracking!

## Getting Your Money Back
- Complete your goal → Money returns to your wallet
- Request a payout anytime from your Money page
- Payouts are processed within 3-5 business days

## Safety First
- Only stake what you can afford to lose
- Start small to test your commitment
- Stakes are non-refundable once the challenge starts
    `,
  },
  "squads-guide": {
    title: "Joining and creating squads",
    category: "Squads & Challenges",
    content: `
# The Complete Squad Guide

## What is a Squad?
A squad is a group of people working on habits together. You can see each other's progress, cheer each other on, and participate in group challenges.

## Joining a Squad
1. **Browse public squads**: Go to Squads → Discover
2. **Use an invite code**: If a friend shared a code, go to Squads → Join with Code
3. **Click a shared link**: Squad invite links work directly

## Creating Your Own Squad
1. Go to Squads → Create New Squad
2. Name your squad and add a description
3. Choose privacy: Public (anyone can join) or Private (invite only)
4. Share the invite code with friends

## Squad Features
- **Group feed**: See when squad members check in
- **Challenges**: Compete with your squad on specific goals
- **Leaderboards**: See who's crushing it
- **Chat**: Message your squad members

## Tips for Active Squads
- Keep it small (5-15 people works best)
- Create weekly challenges to stay engaged
- Celebrate wins publicly
- Be supportive when others struggle
    `,
  },
  "payouts": {
    title: "Getting your money back",
    category: "Money & Stakes",
    content: `
# Payouts Guide

## Requesting a Payout
1. Go to Money → Payouts
2. Enter the amount to withdraw
3. Confirm your payment method
4. Submit the request

## Payout Methods
- **Bank Transfer**: 3-5 business days
- **PayPal**: 1-2 business days
- **Venmo**: 1-2 business days

## Minimum Payout
The minimum payout amount is $10. If your balance is less, you'll need to win more challenges or wait.

## Fees
- Bank transfer: Free
- PayPal/Venmo: 2.5% fee

## Payout Status
- **Pending**: Your request is being processed
- **Processing**: Funds are being transferred
- **Completed**: Money has been sent
- **Failed**: Something went wrong (we'll contact you)

## Common Issues
**"Why is my payout taking so long?"**
First payouts require identity verification, which can take 1-2 extra days.

**"My payout failed"**
Check that your payment details are correct. Contact support if the issue persists.

**"Can I cancel a payout?"**
Payouts can be cancelled within 1 hour of submission.
    `,
  },
};

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const article = helpArticles[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back Link */}
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Help Center
      </Link>

      {/* Article Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
          {article.category}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">{article.title}</h1>
      </div>

      {/* Article Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900">
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(article.content) }} />
        </article>
      </div>

      {/* Feedback Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-center font-semibold text-slate-900">Was this article helpful?</h3>
        <div className="mt-4 flex justify-center gap-4">
          <button
            className="flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-emerald-50 px-6 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            data-testid="help-article-helpful"
          >
            <ThumbsUp className="h-4 w-4" />
            Yes, helpful
          </button>
          <button
            className="flex items-center gap-2 rounded-full border-2 border-slate-200 bg-slate-50 px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            data-testid="help-article-not-helpful"
          >
            <ThumbsDown className="h-4 w-4" />
            Not helpful
          </button>
        </div>
      </div>

      {/* Contact Support */}
      <div className="rounded-xl bg-violet-50 p-4 text-center text-sm text-violet-900">
        <p className="font-semibold">Still need help?</p>
        <p className="mt-1 text-violet-700">
          <Link href="/support/contact" className="font-semibold underline">
            Contact our support team
          </Link>{" "}
          and we'll get back to you within 24 hours.
        </p>
      </div>
    </div>
  );
}

// Simple markdown-to-HTML converter
function formatMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
