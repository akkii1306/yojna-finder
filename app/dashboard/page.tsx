import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Please login to continue.
      </div>
    );
  }

  // Fetch user + profile
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  const profile = user?.profile;
  const isProfileComplete = Boolean(profile);

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {session.user.email}</h1>
        <p className="text-gray-600 mt-1">
          Your personalized Yojana Finder Dashboard
        </p>
      </div>

      {/* PROFILE STATUS + CTA */}
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle>Profile Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isProfileComplete ? (
            <p className="text-green-600 font-medium">
              ✔ Your profile is complete. You can now get personalized Yojana recommendations.
            </p>
          ) : (
            <p className="text-red-600 font-medium">
              ✖ Your profile is incomplete. Please complete it to continue.
            </p>
          )}

          <Link href={isProfileComplete ? "/yojanas" : "/profile"}>
            <Button className="mt-4">
              {isProfileComplete ? "Find Yojanas" : "Complete Profile"}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* DASHBOARD SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Status:{" "}
              {isProfileComplete ? (
                <span className="text-green-600">Complete</span>
              ) : (
                <span className="text-red-600">Incomplete</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Yojana Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Based on your profile and AI analysis</p>
            <Link href="/yojanas">
              <Button className="mt-4">View Recommendations</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/auth/signout" method="post">
              <Button variant="destructive" className="mt-4" type="submit">
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
