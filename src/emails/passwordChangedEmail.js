import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components';

function PasswordChangeEmail({ fullName }) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Password Changed - CleanVeda</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Password changed successfully, {fullName}!</Preview>
            <Section style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
                <Row style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                    <Heading as="h2" style={{ color: '#333' }}>
                        Hi, {fullName}!
                    </Heading>
                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        We wanted to let you know that the password for your CleanVeda account was changed successfully.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        If you made this change, no further action is needed. However, if you didn’t change your password, please contact our support team immediately to secure your account.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
                        You can log in to your account to review any recent activity.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        Thank you for helping us keep your account safe.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
                        Best regards,
                        <br />
                        The CleanVeda Team
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}

export default PasswordChangeEmail;
