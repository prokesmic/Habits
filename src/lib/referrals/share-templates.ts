export const getShareTemplate = (
  type: "success_story" | "milestone" | "challenge" | "generic",
  data: any
) => {
  const templates = {
    success_story: {
      title: `I just completed a ${data.days}-day streak on Habitee!`,
      description: `${data.days} days of ${data.habitName} and counting. Join me and we both get $5!`,
      image: `/og-images/success-${data.userId}.png`,
      cta: "Start Your Journey",
    },
    milestone: {
      title: `Just hit ${data.milestone} on Habitee! 🎉`,
      description: `Building habits that stick with real accountability. Join me!`,
      image: `/og-images/milestone-${data.milestone}.png`,
      cta: "Join Now",
    },
    challenge: {
      title: `I'm challenging myself to ${data.challenge}`,
      description: `Putting $${data.stake} on the line. Think you can do it too?`,
      image: `/og-images/challenge-${data.challengeId}.png`,
      cta: "Accept Challenge",
    },
    generic: {
      title: "Join me on Habitee",
      description: "Build habits that stick with real money on the line. We both get $5!",
      image: "/og-images/default.png",
      cta: "Get Started",
    },
  } as const;
  return templates[type];
};

export const generateOGImage = async (_type: string, _data: any) => {
  // Placeholder - integrate Vercel OG/Canvas later
  return "/og-images/default.png";
};


