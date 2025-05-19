import { Resend } from 'resend';
import { InterviewInvitationEmail } from './template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInterviewEmail(emailTo: string, subject: string, body: string) {
  const { data, error } = await resend.emails.send({
    from: 'Maayu <maayu@maayu.ai>',
    to: [emailTo],
    subject: subject,
    react: <InterviewInvitationEmail title={subject} body={body} />,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}