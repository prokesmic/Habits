import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SquadInvitationEmailProps {
  inviterName: string;
  squadName: string;
  squadDescription?: string;
  inviteLink: string;
  personalMessage?: string;
}

export default function SquadInvitationEmail({
  inviterName = "Someone",
  squadName = "A Squad",
  squadDescription,
  inviteLink = "https://habitio.app/squads/join/abc123",
  personalMessage,
}: SquadInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {inviterName} invited you to join "{squadName}" on Habitio
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={headerSection}>
            <Text style={logo}>Habitio</Text>
          </Section>

          {/* Main Content Card */}
          <Section style={contentCard}>
            {/* Decorative gradient bar */}
            <div style={gradientBar} />

            <Heading style={heading}>You're invited to join a squad!</Heading>

            <Text style={paragraph}>Hi there,</Text>

            <Text style={paragraph}>
              <strong style={highlightText}>{inviterName}</strong> has invited
              you to join their squad{" "}
              <strong style={highlightText}>"{squadName}"</strong> on Habitio.
            </Text>

            {personalMessage && (
              <Section style={messageBox}>
                <Text style={messageLabel}>Personal message:</Text>
                <Text style={messageText}>"{personalMessage}"</Text>
              </Section>
            )}

            {squadDescription && (
              <Section style={descriptionBox}>
                <Text style={descriptionText}>{squadDescription}</Text>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={inviteLink}>
                Join Squad
              </Button>
            </Section>

            <Hr style={hr} />

            {/* What are squads? */}
            <Section style={infoSection}>
              <Text style={infoHeading}>What are Squads?</Text>
              <Text style={infoText}>
                Squads are groups where you can build habits together, share
                progress, stay accountable, and motivate each other to reach
                your goals. Research shows that people who have accountability
                partners are <strong>40% more likely</strong> to achieve their
                goals!
              </Text>
            </Section>

            {/* Benefits */}
            <Section style={benefitsSection}>
              <Text style={benefitItem}>
                <span style={benefitIcon}>💪</span> Build habits together with
                friends
              </Text>
              <Text style={benefitItem}>
                <span style={benefitIcon}>🔥</span> Compete on streak
                leaderboards
              </Text>
              <Text style={benefitItem}>
                <span style={benefitIcon}>💬</span> Chat and motivate each other
              </Text>
              <Text style={benefitItem}>
                <span style={benefitIcon}>🏆</span> Celebrate wins together
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Habitio. Building better habits
              together.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://habitio.app" style={footerLink}>
                Website
              </Link>{" "}
              •{" "}
              <Link href="https://habitio.app/privacy" style={footerLink}>
                Privacy
              </Link>{" "}
              •{" "}
              <Link href="https://habitio.app/terms" style={footerLink}>
                Terms
              </Link>
            </Text>
            <Text style={footerNote}>
              This invitation expires in 7 days. If you didn't expect this
              email, you can safely ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#f6f9fc",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const headerSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logo = {
  fontSize: "28px",
  fontWeight: "bold" as const,
  background: "linear-gradient(135deg, #FF6B35 0%, #8B5CF6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "#FF6B35", // Fallback for email clients that don't support gradient text
  margin: "0",
};

const contentCard = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "0",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  overflow: "hidden" as const,
};

const gradientBar = {
  height: "4px",
  background: "linear-gradient(90deg, #FF6B35 0%, #F59E0B 50%, #8B5CF6 100%)",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "32px 32px 24px",
};

const paragraph = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 32px 16px",
};

const highlightText = {
  color: "#FF6B35",
};

const messageBox = {
  backgroundColor: "#FFF7ED",
  borderLeft: "4px solid #FF6B35",
  borderRadius: "8px",
  margin: "24px 32px",
  padding: "16px",
};

const messageLabel = {
  color: "#9A3412",
  fontSize: "12px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px",
};

const messageText = {
  color: "#C2410C",
  fontSize: "14px",
  fontStyle: "italic" as const,
  lineHeight: "1.5",
  margin: "0",
};

const descriptionBox = {
  backgroundColor: "#F7FAFC",
  borderRadius: "8px",
  margin: "24px 32px",
  padding: "16px",
};

const descriptionText = {
  color: "#4A5568",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#FF6B35",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold" as const,
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#E2E8F0",
  margin: "32px",
};

const infoSection = {
  margin: "0 32px 24px",
};

const infoHeading = {
  color: "#1A202C",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};

const infoText = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const benefitsSection = {
  backgroundColor: "#F7FAFC",
  borderRadius: "12px",
  margin: "0 32px 32px",
  padding: "20px",
};

const benefitItem = {
  color: "#4A5568",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const benefitIcon = {
  marginRight: "8px",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const footerText = {
  color: "#A0AEC0",
  fontSize: "12px",
  margin: "0 0 8px",
};

const footerLinks = {
  color: "#A0AEC0",
  fontSize: "12px",
  margin: "0 0 16px",
};

const footerLink = {
  color: "#718096",
  textDecoration: "underline",
};

const footerNote = {
  color: "#CBD5E0",
  fontSize: "11px",
  margin: "0",
};
