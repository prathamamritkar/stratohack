import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, ArrowUp, ArrowDown, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const leaderboardData = [
  { rank: 1, user: 'AlexCode', score: 98.5, change: 'up', simulations: 42, avatar: 'user1' },
  { rank: 2, user: 'GraphWizard', score: 97.2, change: 'down', simulations: 55, avatar: 'user2' },
  { rank: 3, user: 'FlowMaster', score: 96.8, change: 'up', simulations: 31, avatar: 'user3' },
  { rank: 4, user: 'DataPilot', score: 95.1, change: 'stable', simulations: 60, avatar: 'user4' },
  { rank: 5, user: 'SkyNetAI', score: 94.9, change: 'up', simulations: 25, avatar: 'user5' },
  { rank: 6, user: 'RouteOptimizer', score: 92.3, change: 'down', simulations: 48, avatar: 'user6' },
];

const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-400';
  if (rank === 3) return 'text-orange-400';
  return 'text-muted-foreground';
};

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          Rerouting Leaderboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          Top strategists based on average rerouting efficiency scores.
        </p>
      </header>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Efficiency Score</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Simulations</TableHead>
                <TableHead className="w-[100px] text-center hidden md:table-cell">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank}>
                  <TableCell className="text-center font-bold text-lg">
                    <span className={getRankColor(entry.rank)}>
                      {entry.rank === 1 ? <Crown className="inline-block h-5 w-5 mb-1" /> : entry.rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${entry.avatar}/40/40`} />
                        <AvatarFallback>{entry.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{entry.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-lg">{entry.score.toFixed(1)}%</TableCell>
                  <TableCell className="text-right hidden sm:table-cell">{entry.simulations}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {entry.change === 'up' && <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20"><ArrowUp className="mr-1 h-3 w-3" /> Up</Badge>}
                    {entry.change === 'down' && <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20"><ArrowDown className="mr-1 h-3 w-3" /> Down</Badge>}
                    {entry.change === 'stable' && <Badge variant="outline" className="text-muted-foreground">-</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
