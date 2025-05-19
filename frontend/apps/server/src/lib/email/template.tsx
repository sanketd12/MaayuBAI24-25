import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface InterviewInvitationEmailProps {
  title: string;
  body: string;
}

export const InterviewInvitationEmail = ({
  title,
  body,
}: InterviewInvitationEmailProps) => {
  // Function to preserve newlines in the body text
  const formatBody = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Html>
      <Head />
      <Preview>You're invited to interview with us!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-black m-0 mb-[16px]">
                {title}
              </Heading>
              
              <Text className="text-[16px] text-black mb-[24px]">
                {formatBody(body)}
              </Text>
              
              <Section className="text-center mb-[32px]">
                <Button
                  className="bg-black text-white font-bold py-[12px] px-[20px] rounded-[4px] no-underline text-center box-border"
                  href="https://example.com/confirm-interview"
                >
                  Confirm Interview
                </Button>
              </Section>
              
              <Text className="text-[16px] text-black mb-[32px]">
                We're looking forward to speaking with you!
              </Text>
              
              <Text className="text-[16px] text-black m-0">
                Best regards,
              </Text>
              <Text className="text-[16px] text-black m-0">
                Recruitment Team
              </Text>
            </Section>
            
            <Hr className="border-gray-300 my-[24px]" />
            
            <Section>
              <Text className="text-[12px] text-gray-600 m-0">
                Company Address, City, State ZIP
              </Text>
              <Text className="text-[12px] text-gray-600 m-0">
                © {new Date().getFullYear()} Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-600 m-0">
                <a href="https://example.com/unsubscribe" className="text-gray-600 underline">
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InterviewInvitationEmail.PreviewProps = {
  title: "Interview Invitation for Software Engineer Position",
  body: "Dear Candidate,\n\nThank you for applying for the Software Engineer role at our company. We were impressed with your qualifications and experience, and we would like to invite you to interview with our team.\n\nThe interview will take place on Monday, April 28, 2025 at 2:00 PM EST via Zoom. Please confirm your availability by clicking the button below or responding to this email.\n\nIf you have any questions or need any additional information before the interview, please don't hesitate to reach out."
};

export default InterviewInvitationEmail;