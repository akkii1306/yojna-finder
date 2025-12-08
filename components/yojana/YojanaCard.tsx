import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  title: string;
  score?: number | null;       // ← FIXED: Score now optional
  why: string;
  documents: string[];
  category?: string;
  state?: string | null;
}

export default function YojanaCard({
  title,
  score,
  why,
  documents,
  category,
  state,
}: Props) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all border rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>

        <div className="flex gap-3 mt-2">
          {category && (
            <Badge variant="outline" className="px-3 py-1">
              {category}
            </Badge>
          )}

          {state && (
            <Badge variant="outline" className="px-3 py-1">
              {state === "" ? "National" : state}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Only show AI score if present */}
        {score !== null && score !== undefined && (
          <p className="text-green-600 font-semibold mb-3">
            Fit Score: {score} / 100
          </p>
        )}

        <p className="text-gray-700">{why}</p>

        <Separator className="my-4" />

        <h3 className="font-semibold mb-2">Required Documents:</h3>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          {documents.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
