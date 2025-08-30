import { useState, useEffect } from "react";
import { mockElections } from "./mockData";
import type { Election } from "./types";

export default function useElections() {
  const [elections, setElections] = useState<Election[]>([]);

  useEffect(() => {
    // In future, replace with fetch from API
    setElections(mockElections);
  }, []);

  return { elections };
}
