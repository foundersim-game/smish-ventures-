import { GamePhase, RoomSession } from "./room.types";
import { AvatarKey, PlayerSession } from "./player.types";
import { RoundVoteResolution } from "./vote.types";
import { RoundReceiptsSummary } from "./influence.types";
import { ChaosReportSummary } from "./scoring.types";
import { ChaosModifier } from "./chaos-events.types";
import { SecretMission, MissionEvaluationResult } from "./mission.types";

export type ReactionBuzzerType = "bullshit" | "cap" | "not_moving";

export interface RealtimeEventMap {
  ROOM_UPDATED: { room: RoomSession };
  PLAYERS_UPDATED: { players: PlayerSession[] };
  PLAYER_JOINED: { player: PlayerSession; totalPlayers: number };
  PLAYER_LEFT: { playerId: string; playerName: string; totalPlayers: number };
  PHASE_CHANGED: {
    previousPhase: GamePhase;
    newPhase: GamePhase;
    startTimestamp: number;
    durationSeconds: number;
  };
  VOTE_LOCKED_STATUS: {
    lockedCount: number;
    totalPlayers: number;
    lockedPlayerIds: string[];
  };
  REACTION_BUZZER_FIRED: {
    playerId: string;
    playerName: string;
    buzzerType: ReactionBuzzerType;
    timestamp: number;
  };
  TABLE_EMOJI_REACTION: {
    playerId: string;
    playerName: string;
    avatar: AvatarKey;
    emoji: string;
    timestamp: number;
  };
  CHAOS_MODIFIER_TRIGGERED: {
    modifier: ChaosModifier;
    roundIndex: number;
  };
  SECRET_MISSION_ASSIGNED: {
    playerId: string;
    mission: SecretMission;
  };
  MISSION_EVALUATED: {
    results: MissionEvaluationResult[];
  };
  DISCUSSION_EXTENDED: {
    additionalSeconds: number;
    newDuration: number;
  };
  REVEAL_RESOLVED: {
    resolution: RoundVoteResolution;
    receipts?: RoundReceiptsSummary;
  };
  CONSEQUENCE_RESOLVED: {
    consequence: any;
    updatedResourceState: any;
    isChaosMoment: boolean;
    chaosMomentMessage: string | null;
  };
  RECEIPTS_COMPILED: {
    receipts: RoundReceiptsSummary;
    scoreBreakdowns: Record<string, import('./scoring.types').PlayerScoreBreakdown>;
    missionResults?: MissionEvaluationResult[];
  };
  GAME_CONCLUDED: {
    report: ChaosReportSummary;
  };
}

export type RealtimeEventName = keyof RealtimeEventMap;

export interface RealtimeMessage<T extends RealtimeEventName = RealtimeEventName> {
  type: T;
  payload: RealtimeEventMap[T];
  roomCode: string;
  timestamp: number;
}
