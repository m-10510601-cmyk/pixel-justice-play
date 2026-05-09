import { describe, it, expect } from "vitest";
import { inferCharacter } from "@/components/story/DialogueLine";

const SPEAKERS = [
  "You", "Principal", "Aira's Parent", "Aira",
  "Officer Tan", "Officer Lim", "Profiler", "Suspect A", "Suspect B",
  "Agent", "Friend", "Manager", "Mei (whispering)", "Mei",
  "Supervisor", "Suspect (calmly)", "Bank Liaison", "Caller",
  "Madam Tan", "Suspect", "Tech", "Forensics", "Investigator",
  "Lina", "Mentor", "Doctor", "Student A", "Student B", "Student C",
  "Student D", "Student E", "Victim", "Guardian", "Neighbour A",
  "Neighbour B", "Fake MAS Officer", "Mr. Tan", "Narrator",
  "Bystander", "Defence", "Driver", "Expert", "Journalist (TV)",
  "Prosecution", "Teen A", "Teen B",
];

describe("inferCharacter", () => {
  it("maps every story speaker to a non-narrator key", () => {
    for (const s of SPEAKERS) {
      const k = inferCharacter(s);
      expect(k, `speaker "${s}" should not fall back to narrator`).not.toBe("narrator");
    }
  });

  it("keeps YOU on the player portrait", () => {
    expect(inferCharacter("You")).toBe("you");
  });

  it("strips parentheticals", () => {
    expect(inferCharacter("Mei (whispering)")).toBe(inferCharacter("Mei"));
    expect(inferCharacter("Suspect (calmly)")).toBe("suspect");
  });
});
