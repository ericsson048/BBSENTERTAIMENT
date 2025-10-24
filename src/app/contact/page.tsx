import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-6xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We're here to help. Reach out to us with any questions or inquiries.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div>
          <h2 className="font-headline text-3xl text-primary mb-6">Get in Touch</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message..." />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
        <div>
          <h2 className="font-headline text-3xl text-primary mb-6">Contact Information</h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">Support: <a href="mailto:support@bbs.ent" className="text-primary/80 hover:underline">support@bbs.ent</a></p>
                  <p className="text-muted-foreground">Sales: <a href="mailto:sales@bbs.ent" className="text-primary/80 hover:underline">sales@bbs.ent</a></p>
                </div>
              </div>
               <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-muted-foreground">123 Entertainment Ave, Hollywood, CA 90210</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
