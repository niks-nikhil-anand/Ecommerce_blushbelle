import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function Settings() {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">Settings</h1>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" placeholder="My eCommerce Site" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-email">Admin Email</Label>
            <Input id="site-email" placeholder="admin@example.com" />
          </div>
        </CardContent>
      </Card>

      {/* Store Info */}
      <Card>
        <CardHeader>
          <CardTitle>Store Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input id="store-name" placeholder="Awesome Store" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-address">Store Address</Label>
            <Input id="store-address" placeholder="123 Market St, NY" />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-key">Stripe API Key</Label>
            <Input id="stripe-key" placeholder="sk_test_****" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-email">PayPal Email</Label>
            <Input id="paypal-email" placeholder="paypal@example.com" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates">Order Updates</Label>
            <Switch id="order-updates" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="promo-emails">Promotional Emails</Label>
            <Switch id="promo-emails" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="px-6">Save Changes</Button>
      </div>
    </div>
  )
}
