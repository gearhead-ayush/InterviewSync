import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertTriangle, Bolt, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReviewScreenProps {
  code: string;
}

function ReviewScreen({ code }: ReviewScreenProps) {
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getReview = async () => {
    if (!code) {
      setReview("❌ No code provided for review.");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setReview(data.review || "⚠️ No review available.");
    } catch (error) {
      console.error("Fetch error:", error);
      setReview("❌ Failed to fetch review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center gap-2">
        <Bolt className="text-yellow-500 w-6 h-6" />
        <h2 className="text-xl font-bold">Code Review</h2>
      </div>

      <Button onClick={getReview} className="my-4">
        Get Review
      </Button>

      <Card className="h-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-gray-600 dark:text-gray-300 w-6 h-6" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Analyzing code...</span>
          </div>
        ) : (
          <ScrollArea className="h-[60vh] overflow-auto p-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose dark:prose-invert"
              components={{
                h2: ({ children }) => (
                  <h3 className="text-lg font-semibold mt-4">{children}</h3>
                ),
                p: ({ children }) => <p className="text-gray-700 dark:text-gray-300">{children}</p>,
                ul: ({ children }) => (
                  <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">{children}</ul>
                ),
                li: ({ children }) => (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="text-green-500 w-4 h-4" /> {children}
                  </div>
                ),
                code: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                    {children}
                  </pre>
                ),
              }}
            >
              {review || "💡 Click 'Get Review' to analyze your code."}
            </ReactMarkdown>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}

export default ReviewScreen;
