export type TraitOption = {
  name: string;
  type: "Positive" | "Negative";
  /** Character-creation point change: negative traits grant points; positive traits spend them. */
  points: number;
};

export const OCCUPATIONS: Record<"41" | "42", string[]> = {
  "41": [
    "Unemployed", "Fire Officer", "Police Officer", "Park Ranger", "Construction Worker",
    "Security Guard", "Carpenter", "Burglar", "Chef", "Repairman", "Farmer", "Fisherman",
    "Doctor", "Veteran", "Nurse", "Lumberjack", "Fitness Instructor", "Burger Flipper",
    "Electrician", "Engineer", "Metalworker", "Mechanic",
  ],
  "42": [
    "Custom Occupation", "Blacksmith", "Burger Flipper", "Burglar", "Carpenter", "Chef",
    "Construction Worker", "DIY Expert", "Doctor", "Electrician", "Engineer", "Farmer",
    "Firefighter", "Fishing Guide", "Fitness Instructor", "Lumberjack", "Mechanic", "Nurse",
    "Park Ranger", "Police Officer", "Rancher", "Security Guard", "Tailor", "Veteran", "Welder",
  ],
};

export const STARTING_LOCATIONS: Record<"41" | "42", string[]> = {
  "41": ["Muldraugh", "Riverside", "Rosewood", "West Point"],
  "42": [
    "Brandenburg", "Echo Creek", "Ekron", "Fallas Lake", "Irvington", "March Ridge",
    "Muldraugh", "Riverside", "Rosewood", "Valley Station", "West Point",
  ],
};

type TraitPoints = readonly [name: string, points: number];

const BUILD_41_POSITIVE: TraitPoints[] = [
  ["Adrenaline Junkie", -8], ["Amateur Mechanic", -5], ["Angler", -4], ["Athletic", -10],
  ["Baseball Player", -4], ["Brave", -4], ["Brawler", -6], ["Cat's Eyes", -2], ["Cook", -6],
  ["Dextrous", -2], ["Eagle Eyed", -6], ["Fast Healer", -6], ["Fast Learner", -6],
  ["Fast Reader", -2], ["First Aider", -4], ["Fit", -6], ["Former Scout", -6], ["Gardener", -4],
  ["Graceful", -4], ["Gymnast", -5], ["Handy", -8], ["Herbalist", -6], ["Hiker", -6],
  ["Hunter", -8], ["Inconspicuous", -4], ["Iron Gut", -3], ["Keen Hearing", -6],
  ["Light Eater", -4], ["Low Thirst", -6], ["Lucky", -4], ["Nutritionist", -4], ["Organized", -6],
  ["Outdoorsman", -2], ["Resilient", -4], ["Runner", -4], ["Sewer", -4], ["Speed Demon", -1],
  ["Stout", -6], ["Strong", -10], ["Thick Skinned", -8], ["Wakeful", -2],
];
const BUILD_41_NEGATIVE: TraitPoints[] = [
  ["Agoraphobic", 4], ["All Thumbs", 2], ["Asthmatic", 5], ["Claustrophobic", 4], ["Clumsy", 2],
  ["Conspicuous", 4], ["Cowardly", 2], ["Deaf", 12], ["Disorganized", 4], ["Fear of Blood", 5],
  ["Feeble", 6], ["Hard of Hearing", 4], ["Hearty Appetite", 4], ["High Thirst", 6], ["Illiterate", 8],
  ["Obese", 10], ["Out of Shape", 6], ["Overweight", 6], ["Pacifist", 4], ["Prone to Illness", 4],
  ["Restless Sleeper", 6], ["Short Sighted", 2], ["Sleepyhead", 4], ["Slow Healer", 6],
  ["Slow Learner", 6], ["Slow Reader", 2], ["Smoker", 4], ["Sunday Driver", 1], ["Thin-skinned", 8],
  ["Underweight", 6], ["Unfit", 10], ["Unlucky", 4], ["Very Underweight", 10], ["Weak", 10],
  ["Weak Stomach", 3],
];
const BUILD_42_POSITIVE: TraitPoints[] = [
  ["Adrenaline Junkie", -4], ["Angler", -4], ["Artisan", -2], ["Athletic", -10],
  ["Baseball Player", -4], ["Blacksmith Knowledge", -6], ["Brave", -4], ["Brawler", -6],
  ["Cat's Eyes", -2], ["Crafty", -3], ["Dextrous", -2], ["Eagle Eyed", -4], ["Fast Healer", -6],
  ["Fast Learner", -6], ["Fast Reader", -2], ["First Aider", -4], ["Fit", -6], ["Former Scout", -6],
  ["Gardener", -2], ["Graceful", -4], ["Gymnast", -5], ["Handy", -8], ["Herbalist", -4],
  ["Hiker", -6], ["Hunter", -8], ["Inconspicuous", -4], ["Inventive", -2], ["Iron Gut", -3],
  ["Keen Cook", -3], ["Keen Hearing", -6], ["Light Eater", -2], ["Low Thirst", -2], ["Mason", -2],
  ["Nutritionist", -2], ["Organized", -4], ["Outdoorsy", -2], ["Resilient", -4], ["Runner", -4],
  ["Sewer", -4], ["Speed Demon", -1], ["Stout", -6], ["Strong", -10], ["Thick Skinned", -8],
  ["Vehicle Knowledge", -3], ["Wakeful", -2], ["Whittler", -2], ["Wilderness Knowledge", -8],
];
const BUILD_42_NEGATIVE: TraitPoints[] = [
  ["Agoraphobic", 4], ["All Thumbs", 2], ["Claustrophobic", 4], ["Clumsy", 2], ["Conspicuous", 4],
  ["Cowardly", 2], ["Deaf", 12], ["Disorganized", 6], ["Fast Metabolism", 2], ["Fear of Blood", 5],
  ["Hard of Hearing", 4], ["Hearty Appetite", 4], ["High Thirst", 2], ["Illiterate", 8],
  ["Motion Sensitive", 4], ["Out of Shape", 6], ["Prone to Illness", 4], ["Puny", 10],
  ["Reluctant Fighter", 4], ["Restless Sleeper", 6], ["Short of Breath", 5], ["Short Sighted", 2],
  ["Sleepyhead", 4], ["Slow Healer", 3], ["Slow Learner", 6], ["Slow Metabolism", 2],
  ["Slow Reader", 2], ["Smoker", 3], ["Sunday Driver", 1], ["Thin-skinned", 8], ["Unfit", 10],
  ["Weak", 6], ["Weak Stomach", 3],
];

export const TRAITS: Record<"41" | "42", TraitOption[]> = {
  "41": [
    ...BUILD_41_POSITIVE.map(([name, points]) => ({ name, points, type: "Positive" as const })),
    ...BUILD_41_NEGATIVE.map(([name, points]) => ({ name, points, type: "Negative" as const })),
  ].sort(compareTraitsLikeTheGame),
  "42": [
    ...BUILD_42_POSITIVE.map(([name, points]) => ({ name, points, type: "Positive" as const })),
    ...BUILD_42_NEGATIVE.map(([name, points]) => ({ name, points, type: "Negative" as const })),
  ].sort(compareTraitsLikeTheGame),
};

function compareTraitsLikeTheGame(a: TraitOption, b: TraitOption) {
  const category = Number(a.type === "Negative") - Number(b.type === "Negative");
  if (category !== 0) return category;

  const pointValue = Math.abs(a.points) - Math.abs(b.points);
  return pointValue || a.name.localeCompare(b.name);
}

export const CONDITIONS = ["Healthy", "Minor injuries", "Injured", "Severely injured", "Bitten", "Sick", "Exhausted", "Critical"];
export const WEAPON_TYPES = ["Unarmed", "Axe", "Long Blunt", "Short Blunt", "Long Blade", "Short Blade", "Spear", "Firearm", "Improvised", "Other"];
