export type TraitOption = { name: string; type: "Positive" | "Negative" };

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

const BUILD_41_POSITIVE = [
  "Adrenaline Junkie", "Amateur Mechanic", "Angler", "Athletic", "Baseball Player", "Brave",
  "Brawler", "Cat's Eyes", "Dextrous", "Eagle Eyed", "Fast Healer", "Fast Learner", "Fast Reader",
  "First Aider", "Fit", "Former Scout", "Gardener", "Graceful", "Gymnast", "Handy", "Herbalist",
  "Hiker", "Hunter", "Inconspicuous", "Iron Gut", "Keen Cook", "Keen Hearing", "Light Eater",
  "Low Thirst", "Lucky", "Nutritionist", "Organized", "Outdoorsy", "Resilient", "Runner", "Sewer",
  "Speed Demon", "Stout", "Strong", "Thick Skinned", "Wakeful",
];
const BUILD_41_NEGATIVE = [
  "Agoraphobic", "All Thumbs", "Claustrophobic", "Clumsy", "Conspicuous", "Cowardly", "Deaf",
  "Disorganized", "Fear of Blood", "Hard of Hearing", "Hearty Appetite", "High Thirst", "Illiterate",
  "Obese", "Out of Shape", "Overweight", "Pacifist", "Prone to Illness", "Restless Sleeper",
  "Short of Breath", "Short Sighted", "Sleepyhead", "Slow Healer", "Slow Learner", "Slow Reader",
  "Smoker", "Sunday Driver", "Thin-skinned", "Underweight", "Unfit", "Unlucky", "Very Underweight",
  "Weak", "Weak Stomach",
];
const BUILD_42_POSITIVE = [
  "Adrenaline Junkie", "Angler", "Artisan", "Athletic", "Baseball Player", "Blacksmith Knowledge",
  "Brave", "Brawler", "Cat's Eyes", "Crafty", "Dextrous", "Eagle Eyed", "Fast Healer", "Fast Learner",
  "Fast Reader", "First Aider", "Fit", "Former Scout", "Gardener", "Graceful", "Gymnast", "Handy",
  "Herbalist", "Hiker", "Hunter", "Inconspicuous", "Inventive", "Iron Gut", "Keen Cook", "Keen Hearing",
  "Light Eater", "Low Thirst", "Mason", "Nutritionist", "Organized", "Outdoorsy", "Resilient", "Runner",
  "Sewer", "Speed Demon", "Stout", "Strong", "Thick Skinned", "Vehicle Knowledge", "Wakeful", "Whittler",
  "Wilderness Knowledge",
];
const BUILD_42_NEGATIVE = [
  "Agoraphobic", "All Thumbs", "Claustrophobic", "Clumsy", "Conspicuous", "Cowardly", "Deaf",
  "Disorganized", "Fast Metabolism", "Fear of Blood", "Hard of Hearing", "Hearty Appetite", "High Thirst",
  "Illiterate", "Motion Sensitive", "Out of Shape", "Prone to Illness", "Puny", "Reluctant Fighter",
  "Restless Sleeper", "Short of Breath", "Short Sighted", "Sleepyhead", "Slow Healer", "Slow Learner",
  "Slow Metabolism", "Slow Reader", "Smoker", "Sunday Driver", "Thin-skinned", "Unfit", "Weak", "Weak Stomach",
];

export const TRAITS: Record<"41" | "42", TraitOption[]> = {
  "41": [
    ...BUILD_41_POSITIVE.map((name) => ({ name, type: "Positive" as const })),
    ...BUILD_41_NEGATIVE.map((name) => ({ name, type: "Negative" as const })),
  ],
  "42": [
    ...BUILD_42_POSITIVE.map((name) => ({ name, type: "Positive" as const })),
    ...BUILD_42_NEGATIVE.map((name) => ({ name, type: "Negative" as const })),
  ],
};

export const CONDITIONS = ["Healthy", "Minor injuries", "Injured", "Severely injured", "Bitten", "Sick", "Exhausted", "Critical"];
export const WEAPON_TYPES = ["Unarmed", "Axe", "Long Blunt", "Short Blunt", "Long Blade", "Short Blade", "Spear", "Firearm", "Improvised", "Other"];
