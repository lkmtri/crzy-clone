import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloneGitRepo } from "./actions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <Card className="w-full">
        <form action={cloneGitRepo}>
          <CardHeader>
            <CardTitle>Clone your repository</CardTitle>
            <CardDescription>
              Enter a git repo URL to clone with some side-effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="git_url">Git repo URL</Label>
                <Input id="git_url" name="git_url" type="url" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="git_username">Username</Label>
                <Input id="git_username" name="git_username" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="git_password">Password</Label>
                <Input
                  id="git_password"
                  name="git_password"
                  type="password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Clone</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
