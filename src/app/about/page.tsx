import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(p => p.id === "hero-home")!;
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-6xl">About BBS Entertainment</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Your premier destination for high-fidelity audio, professional-grade visual equipment, and immersive entertainment technology.
        </p>
      </div>

      <div className="relative w-full h-96 mt-12 rounded-lg overflow-hidden shadow-xl">
        <Image 
            src={aboutImage.imageUrl}
            alt="BBS Entertainment workspace"
            fill
            className="object-cover"
            data-ai-hint={aboutImage.imageHint}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div>
          <h2 className="font-headline text-3xl text-primary">Our Mission</h2>
          <p className="mt-4 text-base leading-relaxed">
            At BBS Entertainment, our mission is to empower creators and enthusiasts alike by providing access to the industry’s best audiovisual and entertainment gear. We believe that quality equipment is the key to unlocking creative potential. We are dedicated to curating a selection of products that offer unparalleled performance, reliability, and value.
          </p>
        </div>
        <div>
          <h2 className="font-headline text-3xl text-primary">Our Vision</h2>
          <p className="mt-4 text-base leading-relaxed">
            We envision a world where every story can be told, every sound can be captured, and every moment can be immortalized with crystal-clear quality. BBS Entertainment aims to be more than just a retailer; we strive to be a partner in your creative journey, offering expert advice, community support, and the tools you need to bring your vision to life.
          </p>
        </div>
      </div>
    </div>
  );
}
