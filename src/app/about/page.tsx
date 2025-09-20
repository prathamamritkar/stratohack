import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Cpu, Dna, Rocket, BrainCircuit } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  {
    id: '24f1001764',
    name: 'S.K. Zaheen',
    specialization: 'Predictive Modeling & Data Analytics',
    field: 'Data Science',
    initials: 'SZ',
    icon: <BrainCircuit className="h-5 w-5 text-primary" />,
  },
  {
    id: '24f2003909',
    name: 'Pratham Amritkar',
    specialization: 'AI & Systems Architecture',
    field: 'Computer Engineering',
    initials: 'PA',
    icon: <Cpu className="h-5 w-5 text-primary" />,
  },
  {
    id: '24f2006184',
    name: 'Aparna Jha',
    specialization: 'Human Factors & Biometrics',
    field: 'Biology',
    initials: 'AJ',
    icon: <Dna className="h-5 w-5 text-primary" />,
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">Meet the Team</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The minds behind AirNavFlow, blending expertise from diverse fields to innovate air traffic solutions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="text-center transition-all hover:shadow-primary/20">
              <CardHeader className="items-center">
                <Avatar className="w-24 h-24 mb-4 border-4 border-transparent group-hover:border-primary transition-colors">
                  <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${member.name}`} alt={member.name} />
                  <AvatarFallback className="text-3xl bg-muted">{member.initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">{member.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {member.icon}
                  <p className="font-semibold text-sm">{member.specialization}</p>
                </div>
                <p className="text-xs text-muted-foreground">{member.field}</p>
              </CardContent>
            </Card>
          ))}
        </div>

         <Card className="relative overflow-hidden bg-card/50">
            <CardContent className="p-10 text-center">
                <div className="absolute inset-0 opacity-10">
                     <Image src="https://picsum.photos/seed/teamwork/1200/400" alt="Teamwork" fill className="object-cover" data-ai-hint="abstract technology" />
                </div>
                <div className="relative">
                    <h3 className="text-2xl font-bold font-headline mb-2">Our Vision</h3>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                        We are a team of students passionate about applying cutting-edge technology to solve real-world challenges. By combining our knowledge in AI, data science, and engineering, we aim to build intelligent systems that make global travel safer and more efficient for everyone. This project is a testament to our collaborative spirit and drive to innovate.
                    </p>
                </div>
            </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
