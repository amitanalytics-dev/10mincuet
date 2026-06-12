/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as abTests from "../abTests.js";
import type * as adminTodos from "../adminTodos.js";
import type * as analytics from "../analytics.js";
import type * as blogSeeder from "../blogSeeder.js";
import type * as blogs from "../blogs.js";
import type * as cronHandlers from "../cronHandlers.js";
import type * as cronLogs from "../cronLogs.js";
import type * as crons from "../crons.js";
import type * as educatorNotes from "../educatorNotes.js";
import type * as educatorPayouts from "../educatorPayouts.js";
import type * as educators from "../educators.js";
import type * as emailEvents from "../emailEvents.js";
import type * as feedback from "../feedback.js";
import type * as kidCodes from "../kidCodes.js";
import type * as kpiSnapshots from "../kpiSnapshots.js";
import type * as leaderboards from "../leaderboards.js";
import type * as mockResults from "../mockResults.js";
import type * as ncertExplanations from "../ncertExplanations.js";
import type * as onboarding from "../onboarding.js";
import type * as otpCodes from "../otpCodes.js";
import type * as parentInvites from "../parentInvites.js";
import type * as progress from "../progress.js";
import type * as questionSets from "../questionSets.js";
import type * as quizActivity from "../quizActivity.js";
import type * as readiness from "../readiness.js";
import type * as referrals from "../referrals.js";
import type * as retention from "../retention.js";
import type * as roomChat from "../roomChat.js";
import type * as roomNotes from "../roomNotes.js";
import type * as scheduledEmails from "../scheduledEmails.js";
import type * as seasonRollover from "../seasonRollover.js";
import type * as seed_50_blogs from "../seed_50_blogs.js";
import type * as streaks from "../streaks.js";
import type * as studyRoomAnalytics from "../studyRoomAnalytics.js";
import type * as studyRooms from "../studyRooms.js";
import type * as subscriptions from "../subscriptions.js";
import type * as teamStandings from "../teamStandings.js";
import type * as teams from "../teams.js";
import type * as tournaments from "../tournaments.js";
import type * as users from "../users.js";
import type * as weeklyChallenges from "../weeklyChallenges.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  abTests: typeof abTests;
  adminTodos: typeof adminTodos;
  analytics: typeof analytics;
  blogSeeder: typeof blogSeeder;
  blogs: typeof blogs;
  cronHandlers: typeof cronHandlers;
  cronLogs: typeof cronLogs;
  crons: typeof crons;
  educatorNotes: typeof educatorNotes;
  educatorPayouts: typeof educatorPayouts;
  educators: typeof educators;
  emailEvents: typeof emailEvents;
  feedback: typeof feedback;
  kidCodes: typeof kidCodes;
  kpiSnapshots: typeof kpiSnapshots;
  leaderboards: typeof leaderboards;
  mockResults: typeof mockResults;
  ncertExplanations: typeof ncertExplanations;
  onboarding: typeof onboarding;
  otpCodes: typeof otpCodes;
  parentInvites: typeof parentInvites;
  progress: typeof progress;
  questionSets: typeof questionSets;
  quizActivity: typeof quizActivity;
  readiness: typeof readiness;
  referrals: typeof referrals;
  retention: typeof retention;
  roomChat: typeof roomChat;
  roomNotes: typeof roomNotes;
  scheduledEmails: typeof scheduledEmails;
  seasonRollover: typeof seasonRollover;
  seed_50_blogs: typeof seed_50_blogs;
  streaks: typeof streaks;
  studyRoomAnalytics: typeof studyRoomAnalytics;
  studyRooms: typeof studyRooms;
  subscriptions: typeof subscriptions;
  teamStandings: typeof teamStandings;
  teams: typeof teams;
  tournaments: typeof tournaments;
  users: typeof users;
  weeklyChallenges: typeof weeklyChallenges;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
