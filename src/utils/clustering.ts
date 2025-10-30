import { MOCK_EMPLOYEES } from "../data/mockEmployees";
import type { EmployeeDetailed } from "../data/mockEmployees";
import type { StageType } from "../types";
import { euclideanDistance, normalizeMatrix } from "./statistics";

/**
 * K-means Clustering for Employee Segmentation
 *
 * Clusters employees into 6-8 personas based on:
 * - Stage distribution (4 dimensions)
 * - Age
 * - Tenure
 * - Experience
 * - Dominant stage strength (how strongly one stage shows)
 * - Stage stability (pattern consistency over time)
 * - Role level (encoded)
 * - Work location (encoded)
 */

// Feature vector: 11 dimensions
export interface FeatureVector {
  honeymoon: number;
  selfReflection: number;
  soulSearching: number;
  steadyState: number;
  age: number;
  tenure: number;
  experience: number;
  dominantStageStrength: number;
  stageStability: number;
  roleLevel: number; // 0-4 (Junior to Executive)
  workLocation: number; // 0-2 (Remote, Hybrid, On-site)
}

export interface Cluster {
  id: number;
  centroid: FeatureVector;
  employees: EmployeeDetailed[];
  size: number;
  personaName: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
}

// Encode role level to numeric
const encodeRoleLevel = (role: string): number => {
  const map: Record<string, number> = {
    Junior: 0,
    Mid: 1,
    Senior: 2,
    Lead: 3,
    Executive: 4,
  };
  return map[role] || 1;
};

// Encode work location to numeric
const encodeWorkLocation = (location: string): number => {
  const map: Record<string, number> = {
    Remote: 0,
    Hybrid: 1,
    "On-site": 2,
  };
  return map[location] || 1;
};

// Extract feature vector from employee
export const extractFeatures = (employee: EmployeeDetailed): FeatureVector => ({
  honeymoon: employee.stageDistribution.honeymoon,
  selfReflection: employee.stageDistribution["self-reflection"],
  soulSearching: employee.stageDistribution["soul-searching"],
  steadyState: employee.stageDistribution["steady-state"],
  age: employee.age,
  tenure: employee.tenureYears,
  experience: employee.totalExperienceYears,
  dominantStageStrength: employee.dominantStageStrength,
  stageStability: employee.stageStability,
  roleLevel: encodeRoleLevel(employee.roleLevel),
  workLocation: encodeWorkLocation(employee.workLocation),
});

// Convert feature vector to array
const featureToArray = (f: FeatureVector): number[] => [
  f.honeymoon,
  f.selfReflection,
  f.soulSearching,
  f.steadyState,
  f.age,
  f.tenure,
  f.experience,
  f.dominantStageStrength,
  f.stageStability,
  f.roleLevel,
  f.workLocation,
];

// Convert array back to feature vector
const arrayToFeature = (arr: number[]): FeatureVector => ({
  honeymoon: arr[0],
  selfReflection: arr[1],
  soulSearching: arr[2],
  steadyState: arr[3],
  age: arr[4],
  tenure: arr[5],
  experience: arr[6],
  dominantStageStrength: arr[7],
  stageStability: arr[8],
  roleLevel: arr[9],
  workLocation: arr[10],
});

// Calculate distance between two feature vectors
const distance = (f1: FeatureVector, f2: FeatureVector): number => {
  return euclideanDistance(featureToArray(f1), featureToArray(f2));
};

// K-means++ initialization for better initial centroids
const initializeCentroidsKMeansPlusPlus = (
  data: FeatureVector[],
  k: number
): FeatureVector[] => {
  const centroids: FeatureVector[] = [];

  // Choose first centroid randomly
  centroids.push(data[Math.floor(Math.random() * data.length)]);

  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    const distances = data.map((point) => {
      // Find minimum distance to any existing centroid
      const minDist = Math.min(...centroids.map((c) => distance(point, c)));
      return minDist * minDist; // Square for probability
    });

    // Choose next centroid with probability proportional to distance^2
    const sum = distances.reduce((a, b) => a + b, 0);
    const probabilities = distances.map((d) => d / sum);

    // Weighted random selection
    let rand = Math.random();
    let cumulative = 0;
    for (let j = 0; j < data.length; j++) {
      cumulative += probabilities[j];
      if (rand <= cumulative) {
        centroids.push(data[j]);
        break;
      }
    }
  }

  return centroids;
};

// Main K-means algorithm
export const kMeans = (
  employees: EmployeeDetailed[],
  k: number = 7,
  maxIterations: number = 100
): Cluster[] => {
  // Extract and normalize features
  const features = employees.map(extractFeatures);
  const featureArrays = features.map(featureToArray);
  const normalizedArrays = normalizeMatrix(featureArrays);
  const normalizedFeatures = normalizedArrays.map(arrayToFeature);

  // Initialize centroids using k-means++
  let centroids = initializeCentroidsKMeansPlusPlus(normalizedFeatures, k);

  let assignments: number[] = new Array(employees.length).fill(0);
  let converged = false;
  let iteration = 0;

  while (!converged && iteration < maxIterations) {
    // Assignment step: assign each point to nearest centroid
    const newAssignments = normalizedFeatures.map((feature) => {
      const distances = centroids.map((c) => distance(feature, c));
      return distances.indexOf(Math.min(...distances));
    });

    // Check convergence
    converged = newAssignments.every((a, i) => a === assignments[i]);
    assignments = newAssignments;

    if (converged) break;

    // Update step: recalculate centroids
    for (let i = 0; i < k; i++) {
      const clusterPoints = normalizedFeatures.filter(
        (_, idx) => assignments[idx] === i
      );

      if (clusterPoints.length > 0) {
        const sum: FeatureVector = {
          honeymoon: 0,
          selfReflection: 0,
          soulSearching: 0,
          steadyState: 0,
          age: 0,
          tenure: 0,
          experience: 0,
          dominantStageStrength: 0,
          stageStability: 0,
          roleLevel: 0,
          workLocation: 0,
        };

        clusterPoints.forEach((p) => {
          sum.honeymoon += p.honeymoon;
          sum.selfReflection += p.selfReflection;
          sum.soulSearching += p.soulSearching;
          sum.steadyState += p.steadyState;
          sum.age += p.age;
          sum.tenure += p.tenure;
          sum.experience += p.experience;
          sum.dominantStageStrength += p.dominantStageStrength;
          sum.stageStability += p.stageStability;
          sum.roleLevel += p.roleLevel;
          sum.workLocation += p.workLocation;
        });

        const count = clusterPoints.length;
        centroids[i] = {
          honeymoon: sum.honeymoon / count,
          selfReflection: sum.selfReflection / count,
          soulSearching: sum.soulSearching / count,
          steadyState: sum.steadyState / count,
          age: sum.age / count,
          tenure: sum.tenure / count,
          experience: sum.experience / count,
          dominantStageStrength: sum.dominantStageStrength / count,
          stageStability: sum.stageStability / count,
          roleLevel: sum.roleLevel / count,
          workLocation: sum.workLocation / count,
        };
      }
    }

    iteration++;
  }

  // Build cluster objects
  const clusters: Cluster[] = centroids.map((centroid, i) => {
    const clusterEmployees = employees.filter(
      (_, idx) => assignments[idx] === i
    );

    return {
      id: i,
      centroid,
      employees: clusterEmployees,
      size: clusterEmployees.length,
      personaName: "", // Will be assigned later
      description: "",
      characteristics: [],
      recommendations: [],
    };
  });

  // Sort clusters by size (largest first)
  clusters.sort((a, b) => b.size - a.size);

  // Reassign IDs after sorting
  clusters.forEach((cluster, i) => {
    cluster.id = i;
  });

  // Assign persona names and descriptions
  assignPersonas(clusters);

  return clusters;
};

// Assign persona names based on cluster characteristics
const assignPersonas = (clusters: Cluster[]) => {
  clusters.forEach((cluster, clusterIndex) => {
    const { employees, size } = cluster;

    if (size === 0) {
      cluster.personaName = "Empty Cluster";
      cluster.description = "No employees in this cluster";
      cluster.characteristics = [];
      cluster.recommendations = [];
      return;
    }

    // Calculate average metrics from ACTUAL employee data
    const avgAge = employees.reduce((sum, e) => sum + e.age, 0) / size;
    const avgTenure =
      employees.reduce((sum, e) => sum + e.tenureYears, 0) / size;
    const avgStageStrength =
      employees.reduce((sum, e) => sum + e.dominantStageStrength, 0) / size;
    const avgStability =
      employees.reduce((sum, e) => sum + e.stageStability, 0) / size;

    // Calculate actual stage distribution (not normalized)
    const avgStageDistribution = {
      honeymoon:
        employees.reduce((sum, e) => sum + e.stageDistribution.honeymoon, 0) /
        size,
      selfReflection:
        employees.reduce(
          (sum, e) => sum + e.stageDistribution["self-reflection"],
          0
        ) / size,
      soulSearching:
        employees.reduce(
          (sum, e) => sum + e.stageDistribution["soul-searching"],
          0
        ) / size,
      steadyState:
        employees.reduce(
          (sum, e) => sum + e.stageDistribution["steady-state"],
          0
        ) / size,
    };

    // Find dominant stage from actual percentages
    const dominantStage = Object.keys(avgStageDistribution).reduce((a, b) =>
      avgStageDistribution[a as keyof typeof avgStageDistribution] >
      avgStageDistribution[b as keyof typeof avgStageDistribution]
        ? a
        : b
    ) as "honeymoon" | "selfReflection" | "soulSearching" | "steadyState";

    const dominantStageValue = avgStageDistribution[dominantStage];

    // Map to StageType
    const stageTypeMap: Record<string, StageType> = {
      honeymoon: "honeymoon",
      selfReflection: "self-reflection",
      soulSearching: "soul-searching",
      steadyState: "steady-state",
    };
    const dominantStageType = stageTypeMap[dominantStage];

    // More robust persona classification using multiple criteria
    // Calculate key characteristics
    const isYoung = avgAge < 35;
    const isExperienced = avgAge > 45;
    const isNewHire = avgTenure < 2;
    const isVeteran = avgTenure > 8;
    const hasStrongClarity = avgStageStrength > 50; // Clear dominant stage
    const isHighlyStable = avgStability > 70; // Consistent pattern
    const isUnstable = avgStability < 50; // Volatile/transitioning

    // Strong stage presence (>35% in one stage)
    const strongHoneymoon = avgStageDistribution.honeymoon > 35;
    const strongSteadyState = avgStageDistribution.steadyState > 35;
    const strongSoulSearching = avgStageDistribution.soulSearching > 30;
    const strongSelfReflection = avgStageDistribution.selfReflection > 30;

    // Assign persona based on strongest combination of traits
    if (strongHoneymoon && isYoung) {
      cluster.personaName = "Enthusiastic Newcomers";
      cluster.description =
        "Young professionals in honeymoon phase, full of energy and optimism";
      cluster.characteristics = [
        `Average age: ${Math.round(avgAge)} years`,
        `${avgStageDistribution.honeymoon.toFixed(1)}% Honeymoon stage`,
        `Average tenure: ${avgTenure.toFixed(1)} years`,
        `Eager to learn and contribute`,
      ];
      cluster.recommendations = [
        "Provide mentorship opportunities",
        "Offer clear career progression paths",
        "Encourage skill development programs",
      ];
    } else if (strongSteadyState && (isExperienced || isVeteran)) {
      cluster.personaName = "Seasoned Veterans";
      cluster.description =
        "Experienced professionals with high stability and steady performance";
      cluster.characteristics = [
        `Average age: ${Math.round(avgAge)} years`,
        `${avgStageDistribution.steadyState.toFixed(1)}% Steady-State`,
        `Average tenure: ${avgTenure.toFixed(1)} years`,
        `Deep institutional knowledge`,
      ];
      cluster.recommendations = [
        "Leverage as mentors for junior staff",
        "Recognize long-term contributions",
        "Provide leadership opportunities",
      ];
    } else if (strongSoulSearching) {
      cluster.personaName = "Active Explorers";
      cluster.description =
        "Employees in soul-searching phase, questioning and exploring new possibilities";
      cluster.characteristics = [
        `${avgStageDistribution.soulSearching.toFixed(
          1
        )}% Soul-Searching phase`,
        `Stability: ${Math.round(avgStability)}%`,
        `Exploring options and questioning fit`,
        `Natural transition phase`,
      ];
      cluster.recommendations = [
        "Create space for exploration and dialog",
        "Discuss career goals and interests",
        "Consider role adjustments or new projects",
      ];
    } else if (strongSelfReflection && avgTenure > 2 && avgTenure < 8) {
      cluster.personaName = "Reflective Mid-Careerists";
      cluster.description =
        "Mid-career professionals in self-reflection, evaluating their path";
      cluster.characteristics = [
        `Average tenure: ${avgTenure.toFixed(1)} years`,
        `${avgStageDistribution.selfReflection.toFixed(1)}% Self-Reflection`,
        `Assessing career direction`,
        `Seeking growth opportunities`,
      ];
      cluster.recommendations = [
        "Offer skill development programs",
        "Discuss promotion pathways",
        "Provide stretch assignments",
      ];
    } else if (hasStrongClarity && isHighlyStable) {
      cluster.personaName = "Clear & Stable Contributors";
      cluster.description =
        "Employees with clear stage identity and consistent patterns";
      cluster.characteristics = [
        `Stage clarity: ${Math.round(avgStageStrength)}%`,
        `Stability: ${Math.round(avgStability)}%`,
        `Consistent contributors`,
        `${size} employees`,
      ];
      cluster.recommendations = [
        "Recognize consistent contribution",
        "Provide growth opportunities",
        "Leverage as cultural anchors",
      ];
    } else if (isNewHire && isUnstable) {
      cluster.personaName = "Settling-In Newcomers";
      cluster.description =
        "Recent hires still finding their pattern and place";
      cluster.characteristics = [
        `Average tenure: ${avgTenure.toFixed(1)} years`,
        `Stability: ${Math.round(avgStability)}%`,
        `Still establishing patterns`,
        `Need support and guidance`,
      ];
      cluster.recommendations = [
        "Enhance onboarding process",
        "Assign dedicated mentors",
        "Increase manager check-ins",
      ];
    } else if (dominantStage === "steadyState" && !isExperienced) {
      cluster.personaName = "Early Achievers";
      cluster.description =
        "Younger employees who have reached steady-state early";
      cluster.characteristics = [
        `Average age: ${Math.round(avgAge)} years`,
        `${avgStageDistribution.steadyState.toFixed(1)}% Steady-State`,
        `Found their groove early`,
        `Future leadership potential`,
      ];
      cluster.recommendations = [
        "Fast-track development opportunities",
        "Consider for leadership pipeline",
        "Provide challenging projects",
      ];
    } else {
      // Use dominant stage to name the cluster more specifically
      const stageNames = {
        honeymoon: "Enthusiastic Explorers",
        selfReflection: "Thoughtful Contributors",
        soulSearching: "Transitioning Professionals",
        steadyState: "Stable Performers",
      };

      cluster.personaName =
        stageNames[dominantStage] || `Cluster ${clusterIndex + 1}`;
      cluster.description = `Employees with ${dominantStageValue.toFixed(
        1
      )}% ${dominantStageType.replace("-", " ")} characteristics`;
      cluster.characteristics = [
        `Average age: ${Math.round(avgAge)} years`,
        `Average tenure: ${avgTenure.toFixed(1)} years`,
        `Stage clarity: ${Math.round(
          avgStageStrength
        )}%, Stability: ${Math.round(avgStability)}%`,
        `Dominant stage: ${dominantStageType} (${dominantStageValue.toFixed(
          1
        )}%)`,
      ];
      cluster.recommendations = [
        "Understand stage-specific needs and experiences",
        "Support natural transitions between stages",
        "Create space for stage-appropriate conversations",
      ];
    }
  });
};

// Run k-means with optimal k (using elbow method would be ideal, but 7 is a good default)
export const performClustering = (): Cluster[] => {
  return kMeans(MOCK_EMPLOYEES, 7);
};

// Calculate silhouette score for cluster quality (optional, for future use)
export const calculateSilhouetteScore = (clusters: Cluster[]): number => {
  // Simplified silhouette calculation
  let totalScore = 0;
  let totalPoints = 0;

  clusters.forEach((cluster) => {
    cluster.employees.forEach((employee) => {
      const features = extractFeatures(employee);

      // Calculate average distance to points in same cluster (a)
      const sameClusterDistances = cluster.employees
        .filter((e) => e.id !== employee.id)
        .map((e) => distance(features, extractFeatures(e)));

      const a =
        sameClusterDistances.length > 0
          ? sameClusterDistances.reduce((sum, d) => sum + d, 0) /
            sameClusterDistances.length
          : 0;

      // Calculate minimum average distance to points in other clusters (b)
      const otherClusterDistances = clusters
        .filter((c) => c.id !== cluster.id)
        .map((c) => {
          const distances = c.employees.map((e) =>
            distance(features, extractFeatures(e))
          );
          return distances.reduce((sum, d) => sum + d, 0) / distances.length;
        });

      const b =
        otherClusterDistances.length > 0
          ? Math.min(...otherClusterDistances)
          : 0;

      // Silhouette score for this point
      const s = (b - a) / Math.max(a, b);
      totalScore += s;
      totalPoints++;
    });
  });

  return totalScore / totalPoints;
};
