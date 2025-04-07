
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, User, Mail, Info } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>View your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Name
            </Label>
            <Input id="name" value={user?.name || ''} readOnly />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Label>
            <Input id="email" value={user?.email || ''} readOnly />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="joined" className="flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Joined
            </Label>
            <Input 
              id="joined" 
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''} 
              readOnly 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To log out from all devices, click the button below.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from the current device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
