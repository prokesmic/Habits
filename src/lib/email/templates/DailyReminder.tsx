import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Text,
} from "@react-email/components";

type DailyReminderEmailProps = {
  userName: string;
  habitName: string;
  habitEmoji: string;
  streakCount: number;
  checkInUrl: string;
};

export function DailyReminderEmail({
  userName,
  habitName,
  habitEmoji,
  streakCount,
  checkInUrl,
}: DailyReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ padding: "40px", maxWidth: "600px" }}>
          <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
            {habitEmoji} Time for {habitName}!
          </Text>
          <Text style={{ fontSize: "16px", color: "#666" }}>
            Hey {userName}, don&apos;t break your {streakCount}-day streak! 🔥
          </Text>
          <Section style={{ marginTop: "32px" }}>
            <Button
              href={checkInUrl}
              style={{
                backgroundColor: "#3b82f6",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Check In Now
            </Button>
          </Section>
          <Text style={{ fontSize: "14px", color: "#999", marginTop: "32px" }}>
            Your squad is counting on you! 💪
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

