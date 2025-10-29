'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/logo';
import { useState } from 'react';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (!auth || !firestore) {
        toast({
            title: "Error",
            description: "Firebase not initialized.",
            variant: "destructive"
        })
        return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const newUser = {
            id: user.uid,
            firstName,
            lastName,
            email: user.email,
            joined: new Date().toLocaleDateString(),
            avatar: `user-avatar-${Math.ceil(Math.random() * 2)}`,
            orderCount: 0,
            isAdmin: false,
            favoriteProductIds: []
        };
        
        const userDocRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, newUser, { merge: true });

        toast({
            title: "Account Created!",
            description: "Welcome to BBS Entertainment!",
        });
        
        router.push('/account');
        
    } catch (error: any) {
        toast({
            title: "Sign-up Failed",
            description: error.message,
            variant: "destructive"
        })
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join BBS Entertainment today!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
           </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={handleSignUp}>Sign Up</Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary/80 hover:text-primary">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
