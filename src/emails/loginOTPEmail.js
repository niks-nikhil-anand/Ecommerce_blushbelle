import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from '@react-email/components';

function LoginOtpEmail({ name, email, otp }) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Your CleanVeda.com Login OTP</title>
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
            <Preview>Your Login OTP for CleanVeda.com</Preview>
            <Section style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
                <Row style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                    <Heading as="h2" style={{ color: '#333' }}>Hello {name},</Heading>
                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        You recently requested to log in to CleanVeda.com with the email address <strong>{email}</strong>.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        Please use the following OTP code to log in to your account:
                    </Text>
                    <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                        <Text style={{
                            fontSize: '24px',
                            color: '#007bff',
                            fontWeight: 'bold',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            display: 'inline-block',
                            backgroundColor: '#e6f7ff',
                        }}>
                            {otp}
                        </Text>
                    </Section>
                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        This OTP is valid for the next 10 minutes. Please enter it on the login page to access your account.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
                        If you did not request this login, please ignore this email.
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#555' }}>
                        Best regards,
                        <br />
                        The CleanVeda.com Team
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}

export default LoginOtpEmail;
