'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import contactUsImage from '../../../../public/frontend/contactUsImage.jpg'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { Send, Phone, Mail, MapPin } from 'lucide-react'

// Import shadcn components
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('/api/admin/dashboard/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', mobileNumber: '', message: '' });
      } else {
        toast.error(data.message || 'Something went wrong!');
      }
    } catch (error) {
      toast.error('Failed to send message!');
    } finally {
      setLoading(false);
    }
  };

  // Contact information cards
  const contactInfo = [
    { 
      icon: <Phone className="h-6 w-6 text-blue-500" />, 
      title: "Phone", 
      details: "+1 (555) 000-0000", 
      description: "Monday-Friday from 8am to 5pm"
    },
    { 
      icon: <Mail className="h-6 w-6 text-blue-500" />, 
      title: "Email", 
      details: "support@example.com", 
      description: "We'll respond within 24 hours"
    },
    { 
      icon: <MapPin className="h-6 w-6 text-blue-500" />, 
      title: "Office", 
      details: "123 Main Street, Suite 101", 
      description: "New York, NY 10001"
    }
  ];

  return (
    <div>
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-80 w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/frontend/ProductFeatures/Bg.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
            className="scale-105 transition-transform duration-3000"
            style={{ 
              transform: "translateZ(0)", 
              willChange: "transform"
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative h-full flex items-center justify-center flex-col">
          <motion.h1
            className="text-5xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg text-white/90 max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Our friendly team is here to assist you with any questions or inquiries
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <div className="mx-auto max-w-7xl px-4 mt-8 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
            >
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-blue-50 p-3 rounded-full">
                    {info.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                    <CardDescription>{info.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-blue-600">{info.details}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-7xl py-12 md:py-24">
          <div className="grid items-center gap-x-12 gap-y-10 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="flex items-center justify-center">
              <motion.div 
                className="w-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Card className="border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 md:text-3xl">Leave Us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="grid w-full gap-5 md:gap-6 lg:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="h-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Phone Number</Label>
                        <Input
                          id="mobileNumber"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you today?"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="min-h-32 resize-none"
                        />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          size="lg"
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                          {!loading && <Send className="ml-2 h-4 w-4" />}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Image Section */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative h-full rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={contactUsImage.src}
                  alt="Contact us"
                  width={600}
                  height={800}
                  className="object-cover w-full h-full rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold">We'd love to hear from you</h3>
                  <p className="text-white/80 mt-2">Our team is ready to answer all your questions</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Find quick answers to common questions</p>
          </motion.div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="space-y-4">
                {[
                  { q: "What are your business hours?", a: "We're open Monday through Friday, 9am to 5pm. We're closed on weekends and major holidays." },
                  { q: "Do you offer consultations?", a: "Yes! We offer free 30-minute consultations to discuss your needs and how we can help." },
                  { q: "How quickly do you respond to inquiries?", a: "We aim to respond to all inquiries within 24 business hours." }
                ].map((faq, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-medium">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-4">
                      <p className="text-gray-600">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="services">
              <div className="space-y-4">
                {[
                  { q: "What services do you offer?", a: "We offer a wide range of services including consultation, implementation, and support." },
                  { q: "Do you provide customized solutions?", a: "Yes, we specialize in tailoring our solutions to meet your specific needs and requirements." },
                  { q: "What are your rates?", a: "Our rates vary depending on the project scope. Contact us for a personalized quote." }
                ].map((faq, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-medium">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-4">
                      <p className="text-gray-600">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="support">
              <div className="space-y-4">
                {[
                  { q: "How can I get technical support?", a: "You can reach our support team by email at support@example.com or by phone at +1 (555) 000-0000." },
                  { q: "What is your response time for support tickets?", a: "We aim to respond to all support tickets within 4 business hours." },
                  { q: "Do you offer ongoing maintenance?", a: "Yes, we offer various maintenance packages to keep your systems running smoothly." }
                ].map((faq, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-medium">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-4">
                      <p className="text-gray-600">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Separator className="my-8" />
    </div>
  )
}