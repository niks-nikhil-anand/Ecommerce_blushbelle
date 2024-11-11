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
  
  function NewsLetterEmail({ fullName }) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Welcome to CleanVeda</title>
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
        <Preview>Welcome to CleanVeda, {fullName}! Enjoy 15% off your first order</Preview>
        <Section style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
          <Row style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <Heading as="h2" style={{ color: '#333' }}>
              Welcome, {fullName}!
            </Heading>
            <Text style={{ fontSize: '16px', color: '#555' }}>
              Thank you for subscribing to the CleanVeda newsletter! We’re thrilled to have you with us.
            </Text>
            <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
              As a welcome gift, use the code <strong>CleanVeda15</strong> to enjoy 15% off on your first order!
            </Text>
            <Button
              href="https://www.cleanveda.com"
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '16px',
              }}
            >
              Shop Now
            </Button>
            <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
              CleanVeda is your go-to destination for premium natural health supplements, herbal personal care products, and rejuvenating skin and hair care solutions. 
              Embrace wellness with our organic, cruelty-free products for holistic health.
            </Text>
            <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
              Stay tuned for more promotions, giveaways, and news!
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
  
  export default NewsLetterEmail;
  