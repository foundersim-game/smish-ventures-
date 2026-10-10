"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GameMode, GamePhase, GameSettings, RoomSession } from "@/core/types/room.types";
import { AvatarKey, PlayerSession } from "@/core/types/player.types";
import { ScenarioDefinition } from "@/core/types/scenario.types";
import { RoundVoteResolution } from "@/core/types/vote.types";
import { ChaosReportSummary, PlayerScoreBreakdown } from "@/core/types/scoring.types";
import { ChaosModifier } from "@/core/types/chaos-events.types";
import { MissionEvaluationResult } from "@/core/types/mission.types";
import { ScenarioRegistry } from "@/backend/data/scenarios";
import { PlayerStorage, ActiveSession } from "@/services/storage/player-storage";
import { ApiClient, getApiBaseUrl } from "@/services/network/api-client";
import { VoteEvaluator } from "@/core/engine/vote-evaluator";
import { audio } from "@/services/audio/audio-manager";
import { haptics } from "@/services/haptics/haptics-manager";
import { AdMobService } from "@/services/ads/admob.service";
import { NativePaymentService } from "@/services/payments/native-payment.service";
import { AuthClient } from "@/services/auth/auth-client";

import { HomeScreen } from "@/screens/HomeScreen";
import { JoinScreen } from "@/screens/JoinScreen";
import { ModeSelectScreen } from "@/screens/ModeSelectScreen";
import { ScenarioSelectScreen } from "@/screens/ScenarioSelectScreen";
import { GameSettingsScreen } from "@/screens/GameSettingsScreen";
import { LobbyScreen } from "@/screens/LobbyScreen";
import { InitialVoteScreen } from "@/screens/InitialVoteScreen";
import { DiscussionScreen } from "@/screens/DiscussionScreen";
import { FinalVoteScreen } from "@/screens/FinalVoteScreen";
import { RevealScreen } from "@/screens/RevealScreen";
import { InfluenceScreen } from "@/screens/InfluenceScreen";
import { ConsequenceScreen } from "@/screens/ConsequenceScreen";
import { BlameScreen } from "@/screens/BlameScreen";
import { ChaosReportScreen } from "@/screens/ChaosReportScreen";
import { HostPassModal } from "@/components/organisms/HostPassModal";
import {
  LiveReactionOverlay,
  FloatingEmoji,
  BuzzerAlert,
} from "@/components/organisms/LiveReactionOverlay";
import { ReactionBuzzerType } from "@/core/types/events.types";
import { RoundReceiptsSummary } from "@/core/types/influence.types";

import { HalftimeScreen } from "@/screens/HalftimeScreen";
import { AchievementsScreen } from "@/screens/AchievementsScreen";
import { StoreScreen } from "@/screens/StoreScreen";
import { PlayerProfileScreen } from "@/screens/PlayerProfileScreen";
import { AnalyticsService } from "@/services/analytics/analytics.service";
import { SplashScreen } from "@/components/organisms/SplashScreen";

type ViewState =
  | "home"
  | "join"
  | "mode_select"
  | "scenario_select"
  | "game_settings"
  | "lobby"
  | "gameplay"
  | "halftime"
  | "chaos_report"
  | "achievements"
  | "store"
  | "profile";

const PHASE_ORDER: Record<string, number> = {
  lobby: 0,
  initial_vote: 1,
  discussion: 2,
  final_vote: 3,
  reveal_beat_1: 4,
  reveal_beat_2: 5,
  reveal_beat_3: 6,
  reveal_beat_4: 7,
  reveal_beat_5: 8,
  reveal_beat_6: 9,
  consequence: 10,
  round_wrap: 11,
  influence: 12,
  blame: 13,
  halftime: 14,
  chaos_report: 15,
};

export default function ChaosMainApp() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [view, setView] = useState<ViewState>("home");
  const [selectedMode, setSelectedMode] = useState<GameMode>("party");
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition>(
    ScenarioRegistry.getDefaultPartyScenario()
  );

  const [room, setRoom] = useState<RoomSession | null>(null);
  const [players, setPlayers] = useState<PlayerSession[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerSession | null>(null);
  const [resolution, setResolution] = useState<RoundVoteResolution | null>(null);
  const [receipts, setReceipts] = useState<RoundReceiptsSummary | null>(null);
  const [chaosReport, setChaosReport] = useState<ChaosReportSummary | null>(null);
  const [consequenceData, setConsequenceData] = useState<{
    consequence: { title: string; narrative: string };
    updatedResourceState: Record<string, number>;
    isChaosMoment: boolean;
    chaosMomentMessage: string | null;
    roundIndex?: number;
  } | null>(null);
  const [scoreBreakdowns, setScoreBreakdowns] = useState<
    Record<string, PlayerScoreBreakdown>
  >({});
  const [missionResults, setMissionResults] = useState<MissionEvaluationResult[]>([]);

  // Live Overlays & Events State
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [buzzerAlert, setBuzzerAlert] = useState<BuzzerAlert | null>(null);
  const [activeModifier, setActiveModifier] = useState<ChaosModifier | null>(null);
  const [joinToast, setJoinToast] = useState<string | null>(null);
  const [prefilledJoinCode, setPrefilledJoinCode] = useState("");
  const [showConsequenceHostPass, setShowConsequenceHostPass] = useState(false);
  const [hasSeenHalftime, setHasSeenHalftime] = useState(false);

  // Active Session Persistence State
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const roomRef = useRef<RoomSession | null>(room);
  const viewRef = useRef<ViewState>(view);
  const currentPlayerRef = useRef<PlayerSession | null>(currentPlayer);

  useEffect(() => {
    roomRef.current = room;
    viewRef.current = view;
    currentPlayerRef.current = currentPlayer;
  }, [room, view, currentPlayer]);

  // Initialize profile & detect URL join query (?join=ABCD) & restore live sessions
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("chaos_splash_seen");
      if (seen) setShowSplash(false);
    }

    // Sync weekly dynamic scenarios dropped without app update
    ApiClient.getScenarios().then((dynamicDrops) => {
      if (dynamicDrops && dynamicDrops.length > 0) {
        ScenarioRegistry.registerDynamic(dynamicDrops);
      }
    }).catch(() => {});

    const profile = PlayerStorage.getProfile();
    setCurrentPlayer({
      id: "local_player",
      roomId: "",
      name: profile.name,
      avatar: profile.avatar,
      isHost: false,
      connected: true,
      ready: true,
      initialVoteOptionId: null,
      finalVoteOptionId: null,
      hasLockedInitialVote: false,
      hasLockedFinalVote: false,
      hasSubmittedInfluence: false,
      hasSubmittedBlame: false,
      secretIntel: null,
      secretMission: null,
      stats: {
        decisionsMade: 0,
        mindChanges: 0,
        timesInfluencedOthers: 0,
        timesBlamed: 0,
        totalScore: 0,
      },
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
    });

    const savedSession = PlayerStorage.getActiveSession();
    setActiveSession(savedSession);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("join");
      const ref = params.get("ref");

      const reportInstallReferral = (token: string) => {
        if (!token) return;
        try {
          if (!localStorage.getItem("chaos_install_reported")) {
            localStorage.setItem("chaos_install_reported", "true");
            ApiClient.trackInstallReferral({
              refToken: token,
              newPlayerId: PlayerStorage.getOrCreatePlayerId(),
              visitorFingerprint: PlayerStorage.getDeviceId(),
            }).then((res) => {
              if (res?.rewardGranted) {
                PlayerStorage.activatePass("welcome_referral", 1);
              }
            }).catch(() => {});
          }
        } catch {
          // Ignore
        }
      };

      if (ref) {
        sessionStorage.setItem("chaos_ref_token", ref);
        reportInstallReferral(ref);
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        navigator.clipboard.readText().then((txt) => {
          if (txt && txt.startsWith("CHAOS-REF:")) {
            const parsed = txt.replace("CHAOS-REF:", "").trim();
            if (parsed) reportInstallReferral(parsed);
          }
        }).catch(() => {});
      }
      if (code) {
        setPrefilledJoinCode(code.toUpperCase());
        setView("join");
      } else if (savedSession?.roomCode) {
        // Attempt seamless reconnection on page refresh
        ApiClient.getRoom(savedSession.roomCode)
          .then((fresh) => {
            if (fresh?.room) {
              if (
                fresh.room.phase === "chaos_report" ||
                Date.now() - fresh.room.createdAt > 4 * 60 * 60 * 1000
              ) {
                PlayerStorage.clearActiveSession();
                setActiveSession(null);
                return;
              }

              const me = fresh.players.find(
                (p) =>
                  p.id === savedSession.playerId ||
                  p.name.trim().toLowerCase() === savedSession.playerName.trim().toLowerCase()
              );

              if (me) {
                if (savedSession.isHost || fresh.room.hostId === me.id) {
                  me.isHost = true;
                }
                setRoom(fresh.room);
                setPlayers(fresh.players);
                setCurrentPlayer(me);
                if (fresh.scenario) setSelectedScenario(fresh.scenario);
                if (fresh.resolution) setResolution(fresh.resolution);
                if (fresh.consequence) setConsequenceData(fresh.consequence);

                if (fresh.room.phase === "lobby") {
                  setView("lobby");
                } else {
                  setView("gameplay");
                }

                setJoinToast(`⚡ Reconnected to Room ${fresh.room.roomCode}!`);
                setTimeout(() => setJoinToast(null), 3000);
              }
            }
          })
          .catch(() => {
            PlayerStorage.clearActiveSession();
            setActiveSession(null);
          });
      }

      // Native Capacitor Deep Link listener (e.g. chaos://join?code=ABCD)
      import("@capacitor/app")
        .then(({ App }) => {
          App.addListener("appUrlOpen", (event) => {
            if (!event?.url) return;
            try {
              const raw = event.url;
              if (raw.includes("auth-callback") || raw.includes("access_token") || raw.includes("code=")) {
                AuthClient.handleUrlCallback(raw);
                return;
              }
              const match =
                raw.match(/code=([a-zA-Z0-9]+)/i) ||
                raw.match(/join\/([a-zA-Z0-9]+)/i) ||
                raw.match(/room\/([a-zA-Z0-9]+)/i);
              if (match?.[1]) {
                setPrefilledJoinCode(match[1].toUpperCase());
                setView("join");
              }
            } catch {
              // Non-fatal
            }
          }).catch(() => {});
        })
        .catch(() => {});
    }

    // Initialize native advertising, native billing, and analytics engines
    AdMobService.initialize();
    NativePaymentService.initialize();
    AnalyticsService.initialize();

    // Prevent accidental browser back button from dumping active games
    const handlePopState = (e: PopStateEvent) => {
      if (roomRef.current?.roomCode && viewRef.current !== "home") {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
        const confirmLeave = window.confirm(
          "Are you sure you want to exit to Home? Your seat will remain active so you can rejoin anytime."
        );
        if (confirmLeave) {
          handleLeaveRoom();
        }
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Auto-resync when returning from phone lock or app switch
    const handleVisibilitySync = async () => {
      if (document.visibilityState === "visible") {
        const activeCode = roomRef.current?.roomCode || PlayerStorage.getActiveSession()?.roomCode;
        if (activeCode) {
          try {
            const fresh = await ApiClient.getRoom(activeCode);
            if (fresh?.room) setRoom(fresh.room);
            if (fresh?.players) setPlayers(fresh.players);
            if (fresh?.scenario) setSelectedScenario(fresh.scenario);
            if (fresh?.resolution && fresh.resolution.roundIndex === fresh.room.currentRoundIndex) {
              setResolution(fresh.resolution);
            }
            if (fresh?.consequence && (!fresh.consequence.roundIndex || fresh.consequence.roundIndex === fresh.room.currentRoundIndex)) {
              setConsequenceData(fresh.consequence);
            }
          } catch {
            // Ignore background error
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilitySync);
    window.addEventListener("focus", handleVisibilitySync);

    const existingAcc = PlayerStorage.getAccount();
    if (existingAcc?.email) {
      PlayerStorage.syncCloudProfile(existingAcc.email).then((synced) => {
        if (synced) {
          const p = PlayerStorage.getProfile();
          setCurrentPlayer((prev) => (prev ? { ...prev, name: p.name, avatar: p.avatar } : prev));
        }
      });
    }

    const authUnsub = AuthClient.initAuthListener((acc) => {
      if (acc && typeof window !== "undefined" && window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      if (acc?.email) {
        PlayerStorage.syncCloudProfile(acc.email).then((synced) => {
          if (synced) {
            const p = PlayerStorage.getProfile();
            setCurrentPlayer((prev) => (prev ? { ...prev, name: p.name, avatar: p.avatar } : prev));
          }
        });
      }
    });

    return () => {
      authUnsub();
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilitySync);
      window.removeEventListener("focus", handleVisibilitySync);
    };
  }, []);

  // Synchronize Ad-Free status with AdMob native engine
  useEffect(() => {
    AdMobService.setAdFree(Boolean(room?.isPaidSession));
  }, [room?.isPaidSession]);

  // Realtime SSE Event Listener
  useEffect(() => {
    if (!room?.roomCode) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const sse = new EventSource(`${getApiBaseUrl()}/api/rooms/${room.roomCode}/events`);
    eventSourceRef.current = sse;

    sse.addEventListener("ROOM_UPDATED", (e) => {
      const data = JSON.parse(e.data);
      setRoom(data.room);
    });

    sse.addEventListener("PLAYERS_UPDATED", (e) => {
      const data = JSON.parse(e.data);
      setPlayers(data.players);
      const myId = currentPlayerRef.current?.id;
      if (myId) {
        const me = data.players.find((p: PlayerSession) => p.id === myId);
        if (me) {
          if (roomRef.current?.hostId === me.id || currentPlayerRef.current?.isHost) {
            me.isHost = true;
          }
          setCurrentPlayer(me);
        }
      }
    });

    sse.addEventListener("VOTE_LOCKED_STATUS", (e) => {
      const data = JSON.parse(e.data);
      if (data.lockedPlayerIds) {
        const lockedSet = new Set(data.lockedPlayerIds);
        setPlayers((prev) =>
          prev.map((p) => {
            if (lockedSet.has(p.id)) {
              return { ...p, hasLockedInitialVote: true, hasLockedFinalVote: true };
            }
            return p;
          })
        );
      }
    });

    sse.addEventListener("PLAYER_JOINED", (e) => {
      const data = JSON.parse(e.data);
      if (data?.player) {
        setPlayers((prev) => {
          if (prev.some((p) => p.id === data.player.id)) return prev;
          return [...prev, data.player];
        });
      }
      setJoinToast(`🎉 ${data.player?.name || "A player"} joined the party!`);
      audio.play("click");
      setTimeout(() => setJoinToast(null), 3000);
    });

    sse.addEventListener("PLAYER_LEFT", (e) => {
      const data = JSON.parse(e.data);
      if (data?.playerId) {
        setPlayers((prev) => prev.filter((p) => p.id !== data.playerId));
      }
      setJoinToast(`👋 ${data.playerName || "A player"} left the party.`);
      setTimeout(() => setJoinToast(null), 3000);
    });

    sse.addEventListener("CHAOS_MODIFIER_TRIGGERED", (e) => {
      const data = JSON.parse(e.data);
      setActiveModifier(data.modifier);
      audio.play("fanfare");
      haptics.trigger("chaos_moment");
    });

    sse.addEventListener("SECRET_MISSION_ASSIGNED", (e) => {
      const data = JSON.parse(e.data);
      const myId = currentPlayerRef.current?.id;
      if (myId && data.playerId === myId) {
        setCurrentPlayer((prev) => (prev ? { ...prev, secretMission: data.mission } : prev));
      }
    });

    sse.addEventListener("REACTION_BUZZER_FIRED", (e) => {
      const data = JSON.parse(e.data);
      const titleMap = {
        bullshit: "BULLSHIT! 🚨",
        cap: "CAP! 🧢",
        not_moving: "NO MOVE! 🧱",
      };
      const bgMap = {
        bullshit: "bg-red-900/90",
        cap: "bg-amber-900/90",
        not_moving: "bg-purple-900/90",
      };
      const iconMap = {
        bullshit: "🚨",
        cap: "🧢",
        not_moving: "🧱",
      };

      setBuzzerAlert({
        id: String(Date.now()),
        playerName: data.playerName,
        buzzerType: data.buzzerType,
        title: titleMap[data.buzzerType as ReactionBuzzerType] || "BUZZER!",
        icon: iconMap[data.buzzerType as ReactionBuzzerType] || "🚨",
        bgColor: bgMap[data.buzzerType as ReactionBuzzerType] || "bg-red-900/90",
      });

      // Meme sound plays ONLY on sender's device (handled locally in ReactionBuzzerBar).
      // Remote devices only show the visual banner alert.
      setTimeout(() => setBuzzerAlert(null), 3500);
    });

    sse.addEventListener("TABLE_EMOJI_REACTION", (e) => {
      const data = JSON.parse(e.data);
      const newEmoji: FloatingEmoji = {
        id: `${Date.now()}_${Math.random()}`,
        emoji: data.emoji,
        senderName: data.playerName,
        avatar: data.avatar,
        xPercent: 15 + Math.random() * 65,
      };
      setFloatingEmojis((prev) => [...prev, newEmoji]);
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
      }, 2500);
    });

    sse.addEventListener("PHASE_CHANGED", (e) => {
      const data = JSON.parse(e.data);
      setRoom((prev) => (prev ? { ...prev, phase: data.newPhase } : prev));
      if (data.newPhase === "initial_vote") {
        setReceipts(null);
        setMissionResults([]);
        setConsequenceData(null);
        setResolution(null);
      }
      if (data.newPhase === "chaos_report") {
        setView("chaos_report");
      }
    });

    sse.addEventListener("REVEAL_RESOLVED", (e) => {
      const data = JSON.parse(e.data);
      setResolution(data.resolution);
    });

    sse.addEventListener("CONSEQUENCE_RESOLVED", (e) => {
      const data = JSON.parse(e.data);
      setConsequenceData(data);
      setRoom((prev) => (prev ? { ...prev, resourceState: data.updatedResourceState } : prev));
    });

    sse.addEventListener("RECEIPTS_COMPILED", (e) => {
      const data = JSON.parse(e.data);
      setReceipts(data.receipts);
      setScoreBreakdowns(data.scoreBreakdowns || {});
      if (data.missionResults) {
        setMissionResults(data.missionResults);
      }
    });

    sse.addEventListener("GAME_CONCLUDED", (e) => {
      const data = JSON.parse(e.data);
      setChaosReport(data.report);
      setView("chaos_report");
      PlayerStorage.recordGameCompleted(data.report?.chaosScore);
      PlayerStorage.pushCloudProfile();
      AnalyticsService.trackEvent("game_completed", {
        roomCode: data.report?.roomId,
      });
    });

    return () => {
      sse.close();
      eventSourceRef.current = null;
    };
  }, [room?.roomCode]);

  // Halftime Intermission Trigger (Midway through 8-10 round game)
  useEffect(() => {
    if (
      room &&
      (room.totalRounds ?? 8) >= 8 &&
      room.currentRoundIndex === 5 &&
      !hasSeenHalftime &&
      view === "gameplay"
    ) {
      setHasSeenHalftime(true);
      setView("halftime");
      AnalyticsService.trackEvent("round_started", {
        roundIndex: 5,
        isHalftime: true,
        roomCode: room.roomCode,
      });
    }
  }, [room?.currentRoundIndex, room?.totalRounds, hasSeenHalftime, view, room?.roomCode]);

  // Resilient multi-player room state synchronization (cross-serverless fallback)
  useEffect(() => {
    if (!room?.roomCode) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const fresh = await ApiClient.getRoom(room.roomCode);
        if (!isMounted) return;

        const currentRoundIdx = room.currentRoundIndex;
        setPlayers((prev) => {
          const isSameRound = fresh.room.currentRoundIndex === currentRoundIdx;
          const mergedPlayers = fresh.players.map((fp) => {
            const existing = prev.find((p) => p.id === fp.id);
            if (!existing || !isSameRound) return fp;
            return {
              ...fp,
              hasLockedInitialVote: existing.hasLockedInitialVote || fp.hasLockedInitialVote,
              hasLockedFinalVote: existing.hasLockedFinalVote || fp.hasLockedFinalVote,
              initialVoteOptionId: existing.initialVoteOptionId || fp.initialVoteOptionId,
              finalVoteOptionId: existing.finalVoteOptionId || fp.finalVoteOptionId,
            };
          });

          const prevStr = JSON.stringify(
            prev.map((p) => ({
              id: p.id,
              ready: p.ready,
              connected: p.connected,
              v1: p.hasLockedInitialVote,
              v2: p.hasLockedFinalVote,
              name: p.name,
              score: p.stats.totalScore,
            }))
          );
          const freshStr = JSON.stringify(
            mergedPlayers.map((p) => ({
              id: p.id,
              ready: p.ready,
              connected: p.connected,
              v1: p.hasLockedInitialVote,
              v2: p.hasLockedFinalVote,
              name: p.name,
              score: p.stats.totalScore,
            }))
          );
          return prevStr !== freshStr ? mergedPlayers : prev;
        });

        if (fresh.resolution && fresh.resolution.roundIndex === currentRoundIdx) {
          setResolution(fresh.resolution);
        } else if (resolution && resolution.roundIndex !== currentRoundIdx) {
          setResolution(null);
        }

        if (fresh.consequence && (!fresh.consequence.roundIndex || fresh.consequence.roundIndex === currentRoundIdx)) {
          setConsequenceData(fresh.consequence);
        } else if (consequenceData && consequenceData.roundIndex && consequenceData.roundIndex !== currentRoundIdx) {
          setConsequenceData(null);
        }

        setRoom((prev) => {
          if (!prev) return fresh.room;

          // Never revert round index backward
          if (fresh.room.currentRoundIndex < prev.currentRoundIndex) {
            return prev;
          }

          // If within the same round, only advance phase forward (never downgrade phase)
          if (
            fresh.room.currentRoundIndex === prev.currentRoundIndex &&
            (PHASE_ORDER[fresh.room.phase] ?? 0) < (PHASE_ORDER[prev.phase] ?? 0)
          ) {
            return prev;
          }

          if (
            prev.phase !== fresh.room.phase ||
            prev.currentRoundIndex !== fresh.room.currentRoundIndex ||
            prev.resourceState.balance !== fresh.room.resourceState.balance ||
            prev.resourceState.sanity !== fresh.room.resourceState.sanity ||
            prev.resourceState.chaosScore !== fresh.room.resourceState.chaosScore
          ) {
            // Auto transition screen view if room moved out of lobby to gameplay
            if (fresh.room.phase !== "lobby" && view === "lobby") {
              setView("gameplay");
            } else if (fresh.room.phase === "chaos_report" && view !== "chaos_report") {
              setView("chaos_report");
            }
            return fresh.room;
          }
          return prev;
        });

        const myId = currentPlayerRef.current?.id;
        if (myId) {
          const freshMe = fresh.players.find((p) => p.id === myId);
          if (freshMe) {
            if (fresh.room.hostId === freshMe.id || currentPlayerRef.current?.isHost) {
              freshMe.isHost = true;
            }
            setCurrentPlayer((prev) => {
              if (!prev) return freshMe;
              const isSameRound = fresh.room.currentRoundIndex === currentRoundIdx;
              const protectedFreshMe = {
                ...freshMe,
                hasLockedInitialVote: isSameRound
                  ? prev.hasLockedInitialVote || freshMe.hasLockedInitialVote
                  : freshMe.hasLockedInitialVote,
                hasLockedFinalVote: isSameRound
                  ? prev.hasLockedFinalVote || freshMe.hasLockedFinalVote
                  : freshMe.hasLockedFinalVote,
                initialVoteOptionId: isSameRound
                  ? prev.initialVoteOptionId || freshMe.initialVoteOptionId
                  : freshMe.initialVoteOptionId,
                finalVoteOptionId: isSameRound
                  ? prev.finalVoteOptionId || freshMe.finalVoteOptionId
                  : freshMe.finalVoteOptionId,
              };

              if (
                prev.hasLockedInitialVote !== protectedFreshMe.hasLockedInitialVote ||
                prev.hasLockedFinalVote !== protectedFreshMe.hasLockedFinalVote ||
                prev.initialVoteOptionId !== protectedFreshMe.initialVoteOptionId ||
                prev.finalVoteOptionId !== protectedFreshMe.finalVoteOptionId ||
                prev.isHost !== protectedFreshMe.isHost ||
                JSON.stringify(prev.secretMission) !== JSON.stringify(protectedFreshMe.secretMission)
              ) {
                return protectedFreshMe;
              }
              return prev;
            });
          }
        }
      } catch {
        // Ignore background polling glitches
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [room?.roomCode, currentPlayer?.id, view]);

  // Audio Architecture: Continuous BGM is disabled so phones do not compete with in-person discussions.
  // Tactile game-show SFX (buzzers, locks, timer ticks, reveals, fanfare) provide all energetic feedback.
  useEffect(() => {
    audio.stopBGM();
  }, [room?.phase, view]);

  // Host creates room with their own saved profile (or updates existing room settings)
  const handleStartChaos = async (settings: GameSettings) => {
    try {
      if (room && currentPlayer?.isHost) {
        const res = await ApiClient.updateSettings(room.roomCode, currentPlayer.id, settings);
        setRoom(res.room);
        setView("lobby");
        return;
      }

      const profile = PlayerStorage.getProfile();
      const hostPlayerId = PlayerStorage.getOrCreatePlayerId();
      const res = await ApiClient.createRoom({
        hostName: profile.name,
        hostAvatar: profile.avatar,
        hostPlayerId,
        mode: selectedMode,
        scenarioId: selectedScenario.id,
        settings,
      });

      setRoom(res.room);
      setPlayers([res.host]);
      setCurrentPlayer(res.host);
      setHasSeenHalftime(false);

      // Save active session for instant reconnection on refresh
      PlayerStorage.saveActiveSession({
        roomCode: res.room.roomCode,
        roomId: res.room.id,
        playerId: res.host.id,
        playerName: res.host.name,
        avatar: res.host.avatar,
        isHost: true,
      });
      setActiveSession(PlayerStorage.getActiveSession());

      AnalyticsService.trackEvent("room_created", {
        roomCode: res.room.roomCode,
        scenarioId: selectedScenario.id,
        rounds: settings.totalRounds,
      });
      setView("lobby");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create game");
    }
  };

  // Real player joins via room code (or reconnects existing seat)
  const handleJoinRoom = async (code: string, name: string, avatar: AvatarKey) => {
    const persistentId = PlayerStorage.getOrCreatePlayerId();
    const res = await ApiClient.joinRoom(code, name, avatar, persistentId);
    if (res.room.hostId === res.player.id) {
      res.player.isHost = true;
    }
    setRoom(res.room);
    setCurrentPlayer(res.player);
    setHasSeenHalftime(false);

    // Save active session for instant reconnection on refresh
    PlayerStorage.saveActiveSession({
      roomCode: res.room.roomCode,
      roomId: res.room.id,
      playerId: res.player.id,
      playerName: res.player.name,
      avatar: res.player.avatar,
      isHost: res.player.isHost,
    });
    setActiveSession(PlayerStorage.getActiveSession());

    AnalyticsService.trackEvent("player_joined", {
      roomCode: code,
      playerName: name,
    });
    const updated = await ApiClient.getRoom(code);
    setPlayers(updated.players);
    if (updated.scenario) {
      setSelectedScenario(updated.scenario);
    }
    if (updated.resolution) {
      setResolution(updated.resolution);
    }

    // Report verified inbound referral attribution (Proof-of-Reach)
    try {
      const storedRef = sessionStorage.getItem("chaos_ref_token");
      fetch(`${getApiBaseUrl()}/api/referrals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refToken: storedRef || undefined,
          roomCode: code,
          joiningPlayerId: res.player.id,
          visitorFingerprint: PlayerStorage.getDeviceId(),
        }),
      }).catch(() => {});
    } catch {
      // Ignore tracking errors
    }

    // Restore correct view: If game has already progressed beyond lobby, resume directly into gameplay!
    if (res.room.phase === "lobby") {
      setView("lobby");
    } else if (res.room.phase === "chaos_report") {
      setView("chaos_report");
    } else {
      setView("gameplay");
    }
  };

  // Manual Rejoin from Home screen CTA
  const handleRejoinSession = async (session: ActiveSession) => {
    try {
      const fresh = await ApiClient.getRoom(session.roomCode);
      const me = fresh.players.find(
        (p) =>
          p.id === session.playerId ||
          p.name.trim().toLowerCase() === session.playerName.trim().toLowerCase()
      );
      if (me) {
        if (session.isHost || fresh.room.hostId === me.id) {
          me.isHost = true;
        }
        setRoom(fresh.room);
        setPlayers(fresh.players);
        setCurrentPlayer(me);
        if (fresh.scenario) setSelectedScenario(fresh.scenario);
        if (fresh.resolution) setResolution(fresh.resolution);
        if (fresh.consequence) setConsequenceData(fresh.consequence);
        if (fresh.room.phase === "lobby") {
          setView("lobby");
        } else if (fresh.room.phase === "chaos_report") {
          setView("chaos_report");
        } else {
          setView("gameplay");
        }
        setJoinToast(`⚡ Reconnected to Room ${fresh.room.roomCode}!`);
        setTimeout(() => setJoinToast(null), 3000);
      } else {
        await handleJoinRoom(session.roomCode, session.playerName, session.avatar);
      }
    } catch (err: unknown) {
      PlayerStorage.clearActiveSession();
      setActiveSession(null);
      alert(err instanceof Error ? err.message : "Room is no longer active");
    }
  };

  // Host adds an AI / Demo bot player to the lobby
  const handleAddBot = async () => {
    if (!room || !currentPlayer) return;
    try {
      const res = await ApiClient.addBotPlayer(room.roomCode, currentPlayer.id);
      if (res?.player) {
        setPlayers((prev) => {
          if (prev.some((p) => p.id === res.player.id)) return prev;
          return [...prev, res.player];
        });
      }
      const updated = await ApiClient.getRoom(room.roomCode);
      if (updated?.room) setRoom(updated.room);
      if (updated?.players?.length) setPlayers(updated.players);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to add bot player");
    }
  };

  // Host kicks a player from the lobby
  const handleKickPlayer = async (targetPlayerId: string) => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.kickPlayer(room.roomCode, currentPlayer.id, targetPlayerId);
      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to remove player");
    }
  };

  // Host starts game from lobby
  // Activate Host Pass for ad-free room and expansions
  const handleActivateHostPass = async () => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.activateHostPass(room.roomCode, currentPlayer.id);
      setRoom((prev) => (prev ? { ...prev, isPaidSession: true } : prev));
    } catch {
      // Ignore
    }
  };

  const handleStartGameFromLobby = async () => {
    if (!room || !currentPlayer) return;
    try {
      const res = await ApiClient.sendAction<{ room?: RoomSession }>(
        room.roomCode,
        currentPlayer.id,
        "START_GAME"
      );
      if (res?.room) {
        setRoom(res.room);
      }
      setView("gameplay");
      AnalyticsService.trackEvent("game_started", {
        roomCode: room.roomCode,
        scenarioId: room.scenarioId,
        totalPlayers: players.length,
        totalRounds: room.totalRounds,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to start");
    }
  };

  // Player locks initial vote
  const handleLockInitialVote = async (optionId: string) => {
    if (!room || !currentPlayer) return;
    PlayerStorage.recordDecision();
    // Optimistic local state update for instant UI feedback
    setCurrentPlayer((prev) =>
      prev ? { ...prev, initialVoteOptionId: optionId, hasLockedInitialVote: true } : prev
    );
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id
          ? { ...p, initialVoteOptionId: optionId, hasLockedInitialVote: true }
          : p
      )
    );
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "LOCK_INITIAL_VOTE", {
        optionId,
      });
      AnalyticsService.trackEvent("vote_submitted", {
        stage: "initial",
        optionId,
        roundIndex: room.currentRoundIndex,
        roomCode: room.roomCode,
      });

      // Auto-simulate only AI bot players if any exist
      const botPlayers = players.filter(
        (p) =>
          (p.id.startsWith("bot_") ||
            p.name === "Riya" ||
            p.name === "Karan" ||
            p.name === "Simran" ||
            p.name === "Vishal" ||
            p.name === "Neha" ||
            p.name === "Zack" ||
            p.name === "Maya" ||
            p.name === "Leo") &&
          p.id !== currentPlayer.id &&
          !p.hasLockedInitialVote
      );

      if (botPlayers.length > 0) {
        setTimeout(async () => {
          try {
            await Promise.all(
              botPlayers.map((bot) => {
                const options = ["A", "B", "C", "D"];
                const opt = options[Math.floor(Math.random() * options.length)];
                return ApiClient.sendAction(room.roomCode, bot.id, "LOCK_INITIAL_VOTE", {
                  optionId: opt,
                }).catch((e) => console.error("Error locking bot vote:", e));
              })
            );
          } catch (e) {
            console.error("Error locking bot votes batch:", e);
          }
        }, 300);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Discussion time expires or Vote Now clicked
  const handleDiscussionTimeUp = async () => {
    if (!room || !currentPlayer) return;
    // Optimistically advance room phase so there is zero latency flicker
    setRoom((prev) => (prev ? { ...prev, phase: "final_vote" } : prev));
    try {
      const res = await ApiClient.sendAction(room.roomCode, currentPlayer.id, "SKIP_DISCUSSION");
      if (res?.room) {
        setRoom(res.room);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Player locks final vote
  const handleLockFinalVote = async (optionId: string) => {
    if (!room || !currentPlayer) return;
    PlayerStorage.recordDecision();
    // Optimistic local state update for instant UI feedback
    setCurrentPlayer((prev) =>
      prev ? { ...prev, finalVoteOptionId: optionId, hasLockedFinalVote: true } : prev
    );
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id
          ? { ...p, finalVoteOptionId: optionId, hasLockedFinalVote: true }
          : p
      )
    );
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "LOCK_FINAL_VOTE", {
        optionId,
      });
      AnalyticsService.trackEvent("vote_submitted", {
        stage: "final",
        optionId,
        roundIndex: room.currentRoundIndex,
        roomCode: room.roomCode,
      });

      // Achievement progress tracking
      if (currentPlayer.initialVoteOptionId && currentPlayer.initialVoteOptionId !== optionId) {
        PlayerStorage.recordAchievementProgress("instigator", 1, 5);
      } else if (currentPlayer.initialVoteOptionId && currentPlayer.initialVoteOptionId === optionId) {
        PlayerStorage.recordAchievementProgress("unshakable", 1, 5);
      }
      const allLocked = players.map((p) => (p.id === currentPlayer.id ? optionId : p.finalVoteOptionId)).filter(Boolean);
      if (allLocked.length === players.length && players.length >= 2 && allLocked.every((v) => v === optionId)) {
        PlayerStorage.recordAchievementProgress("same_brain", 1, 1);
      }

      // Simulate bot final votes if any
      const botPlayers = players.filter(
        (p) =>
          (p.id.startsWith("bot_") ||
            p.name === "Riya" ||
            p.name === "Karan" ||
            p.name === "Simran" ||
            p.name === "Vishal" ||
            p.name === "Neha" ||
            p.name === "Zack" ||
            p.name === "Maya" ||
            p.name === "Leo") &&
          p.id !== currentPlayer.id &&
          !p.hasLockedFinalVote
      );

      if (botPlayers.length > 0) {
        setTimeout(async () => {
          try {
            await Promise.all(
              botPlayers.map((bot) => {
                const flipOpt =
                  bot.name === "Riya" || bot.name === "Karan"
                    ? "B"
                    : bot.initialVoteOptionId || "B";
                return ApiClient.sendAction(room.roomCode, bot.id, "LOCK_FINAL_VOTE", {
                  optionId: flipOpt,
                }).catch((e) => console.error("Error locking bot final vote:", e));
              })
            );
          } catch (e) {
            console.error("Error locking bot final votes batch:", e);
          }
        }, 300);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Advance reveal beat (memoized to prevent duplicate render loops)
  const handleAdvanceRevealBeat = useCallback(
    async (targetBeat: GamePhase) => {
      const currentCode = room?.roomCode;
      const currentMyId = currentPlayer?.id;
      if (!currentCode || !currentMyId) return;
      try {
        await ApiClient.sendAction(currentCode, currentMyId, "ADVANCE_REVEAL_BEAT", {
          targetBeat,
        });
        const updated = await ApiClient.getRoom(currentCode);
        setRoom(updated.room);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [room?.roomCode, currentPlayer?.id]
  );

  // Submit Influence attribution
  const handleSubmitInfluence = async (targetPlayerId: string | null, reason?: string) => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "SUBMIT_INFLUENCE", {
        roundIndex: room.currentRoundIndex,
        influencedByPlayerId: targetPlayerId,
        reason,
      });

      // Bots submit their influence
      for (const p of players) {
        if (p.id !== currentPlayer.id) {
          const others = players.filter((o) => o.id !== p.id);
          const rand = others[Math.floor(Math.random() * others.length)];
          await ApiClient.sendAction(room.roomCode, p.id, "SUBMIT_INFLUENCE", {
            roundIndex: room.currentRoundIndex,
            influencedByPlayerId: rand?.id || null,
          }).catch(() => { });
        }
      }

      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
      const me = updated.players.find((p) => p.id === currentPlayer.id);
      if (me) setCurrentPlayer(me);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Submit Blame nomination
  const handleSubmitBlame = async (blamedPlayerId: string) => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "SUBMIT_BLAME", {
        roundIndex: room.currentRoundIndex,
        blamedPlayerId,
      });

      // Bots cast blame as well
      for (const p of players) {
        if (p.id !== currentPlayer.id) {
          const targets = players.filter((o) => o.id !== p.id);
          const rand = targets[Math.floor(Math.random() * targets.length)];
          await ApiClient.sendAction(room.roomCode, p.id, "SUBMIT_BLAME", {
            roundIndex: room.currentRoundIndex,
            blamedPlayerId: rand?.id || currentPlayer.id,
          }).catch(() => { });
        }
      }

      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Compile Receipts
  const handleCompileReceipts = async (): Promise<RoundReceiptsSummary> => {
    if (!room || !currentPlayer) throw new Error("No active room");
    const res = await ApiClient.sendAction(room.roomCode, currentPlayer.id, "COMPILE_RECEIPTS");
    const compiled = res.receipts as RoundReceiptsSummary;
    setReceipts(compiled);
    if (res.missionResults && Array.isArray(res.missionResults)) {
      setMissionResults(res.missionResults);
      const myMission = res.missionResults.find((m: { playerId: string; success?: boolean; completed?: boolean }) => m.playerId === currentPlayer.id);
      const myReceipt = compiled?.receipts?.find((r) => r.playerId === currentPlayer.id);
      if (myMission && (myMission.success || myMission.completed) && (!myReceipt || myReceipt.blameVotesReceived === 0)) {
        PlayerStorage.recordAchievementProgress("ghost_saboteur", 1, 3);
      }
    }
    return compiled;
  };

  // Next round
  const handleNextRound = async () => {
    if (!room || !currentPlayer) return;
    try {
      setReceipts(null);
      setMissionResults([]);
      setConsequenceData(null);
      setResolution(null);
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "NEXT_ROUND");
      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
      const me = updated.players.find((p) => p.id === currentPlayer.id);
      if (me) setCurrentPlayer(me);
      if (updated.room.phase === "chaos_report") {
        PlayerStorage.recordGameCompleted(updated.room.resourceState?.chaosScore);
        PlayerStorage.pushCloudProfile();
        if (currentPlayer.isHost && updated.players.length >= 4) {
          PlayerStorage.recordAchievementProgress("party_monarch", 1, 5);
        }
        if (updated.room.resourceState?.chaosScore && updated.room.resourceState.chaosScore >= 100) {
          PlayerStorage.recordAchievementProgress("chaos_overlord", 1, 1);
        }
        if (updated.room.resourceState?.balance && updated.room.resourceState.balance >= 30000) {
          PlayerStorage.recordAchievementProgress("high_roller", 1, 1);
        }
        setView("chaos_report");
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Table reaction buzzer
  const handleBuzzer = async (type: ReactionBuzzerType) => {
    if (!room || !currentPlayer) return;
    try {
      if (type === "bullshit") {
        PlayerStorage.recordAchievementProgress("buzzer_master", 1, 10);
      }
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "TRIGGER_BUZZER", {
        buzzerType: type,
      });
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Live Floating Emoji Reaction
  const handleSendEmojiReaction = async (emoji: string) => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendEmojiReaction(room.roomCode, currentPlayer.id, emoji);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleDismissActiveSession = () => {
    PlayerStorage.clearActiveSession();
    setActiveSession(null);
  };

  const handleLeaveRoom = () => {
    // Keep active session stored so the player can rejoin anytime from Home screen CTA
    const session = PlayerStorage.getActiveSession();
    setActiveSession(session);
    setRoom(null);
    setView("home");
  };

  const currentRound =
    selectedScenario.rounds[(room?.currentRoundIndex || 1) - 1] || selectedScenario.rounds[0];

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full bg-[#06010D] flex items-center justify-center overflow-hidden">
      {/* Studio Ambient Backlights for Desktop */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Game Screen Canvas */}
      <div className="relative h-[100dvh] max-h-[100dvh] w-full max-w-[440px] bg-[#080210] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(168,85,247,0.2)] flex flex-col justify-between overflow-hidden">
        {/* Intro Splash Screen */}
        {showSplash && (
          <SplashScreen
            onComplete={() => {
              setShowSplash(false);
              if (typeof window !== "undefined") {
                sessionStorage.setItem("chaos_splash_seen", "true");
              }
            }}
          />
        )}

        {/* Global Floating Reactions & Buzzer Alerts Overlay */}
        <LiveReactionOverlay
          floatingEmojis={floatingEmojis}
          buzzerAlert={buzzerAlert}
          joinToast={joinToast}
        />

        {/* 1. HOME SCREEN (Screen 1) */}
        {view === "home" && (
          <HomeScreen
            onCreateParty={() => {
              setSelectedMode("party");
              setSelectedScenario(ScenarioRegistry.getDefaultPartyScenario());
              setView("mode_select");
            }}
            onJoinParty={() => setView("join")}
            onCouplesMode={() => {
              setSelectedMode("couples");
              setSelectedScenario(ScenarioRegistry.getDefaultCouplesScenario());
              setView("scenario_select");
            }}
            onOpenAchievements={() => setView("achievements")}
            onOpenStore={() => setView("store")}
            onOpenProfile={() => setView("profile")}
            activeSession={activeSession}
            onRejoinSession={handleRejoinSession}
            onDismissSession={handleDismissActiveSession}
          />
        )}

        {/* ACHIEVEMENTS FULL PAGE SCREEN */}
        {view === "achievements" && (
          <AchievementsScreen
            onBack={() => setView("home")}
            onOpenHome={() => setView("home")}
            onOpenProfile={() => setView("profile")}
            onOpenStore={() => setView("store")}
          />
        )}

        {/* STORE FULL PAGE SCREEN */}
        {view === "store" && (
          <StoreScreen
            onBack={() => setView("home")}
            onOpenHome={() => setView("home")}
            onOpenProfile={() => setView("profile")}
            onOpenAchievements={() => setView("achievements")}
          />
        )}

        {/* MY PLAYER FULL PAGE SCREEN */}
        {view === "profile" && (
          <PlayerProfileScreen
            onBack={() => setView("home")}
            onOpenHome={() => setView("home")}
            onOpenAchievements={() => setView("achievements")}
            onOpenStore={() => setView("store")}
            onSaved={(name, avatar) => {
              setCurrentPlayer((prev) => (prev ? { ...prev, name, avatar } : prev));
            }}
          />
        )}

        {/* 2. JOIN GAME SCREEN */}
        {view === "join" && (
          <JoinScreen
            initialCode={prefilledJoinCode}
            onJoin={handleJoinRoom}
            onBack={() => setView("home")}
          />
        )}

        {/* 3. MODE SELECT SCREEN (Screen 2) */}
        {view === "mode_select" && (
          <ModeSelectScreen
            initialMode={selectedMode}
            onBack={() => setView("home")}
            onSelectMode={(mode) => {
              setSelectedMode(mode);
              setSelectedScenario(ScenarioRegistry.getDefaultScenarioForMode(mode));
              setView("scenario_select");
            }}
          />
        )}

        {/* 4. SCENARIO SELECT SCREEN (Screen 3 & 5) */}
        {view === "scenario_select" && (
          <ScenarioSelectScreen
            mode={selectedMode}
            onBack={() => setView("mode_select")}
            onSelectScenario={(sc) => {
              setSelectedScenario(sc);
              setView("game_settings");
            }}
          />
        )}

        {/* 5. GAME SETTINGS SCREEN (Screen 6) */}
        {view === "game_settings" && (
          <GameSettingsScreen
            scenario={selectedScenario}
            onBack={() => setView(room ? "lobby" : "scenario_select")}
            onStartChaos={handleStartChaos}
          />
        )}

        {/* 6. LOBBY SCREEN (Screen 7) */}
        {view === "lobby" && room && currentPlayer && (
          <LobbyScreen
            room={room}
            players={players}
            currentPlayerId={currentPlayer.id}
            currentPlayer={currentPlayer}
            onStartGame={handleStartGameFromLobby}
            onLeaveRoom={handleLeaveRoom}
            onEditSettings={() => setView("game_settings")}
            onAddBot={handleAddBot}
            onKickPlayer={handleKickPlayer}
            onActivatePass={handleActivateHostPass}
          />
        )}

        {/* 7. GAMEPLAY SCREENS (Screen 8 to 12 & Screen Reveal) */}
        {view === "gameplay" && room && currentPlayer && (
          <>
            {room.phase === "initial_vote" && (
              <InitialVoteScreen
                room={room}
                round={currentRound}
                players={players}
                currentPlayer={currentPlayer}
                onLockVote={handleLockInitialVote}
                onLeave={handleLeaveRoom}
              />
            )}

            {room.phase === "discussion" && (
              <DiscussionScreen
                room={room}
                currentPlayerId={currentPlayer.id}
                isHost={currentPlayer.isHost}
                activeModifier={activeModifier}
                secretMission={currentPlayer.secretMission}
                onTimeUp={handleDiscussionTimeUp}
                onExtendDiscussion={() =>
                  ApiClient.sendAction(room.roomCode, currentPlayer.id, "EXTEND_DISCUSSION", {
                    seconds: 30,
                  })
                }
                onSkipDiscussion={handleDiscussionTimeUp}
                onBuzzer={handleBuzzer}
                onSendEmoji={handleSendEmojiReaction}
                onLeave={handleLeaveRoom}
              />
            )}

            {room.phase === "final_vote" && (
              <FinalVoteScreen
                room={room}
                round={currentRound}
                currentPlayer={currentPlayer}
                onLockFinalVote={handleLockFinalVote}
                onLeave={handleLeaveRoom}
              />
            )}

            {[
              "reveal_beat_1",
              "reveal_beat_2",
              "reveal_beat_3",
              "reveal_beat_4",
              "reveal_beat_5",
              "reveal_beat_6",
            ].includes(room.phase) && (
                <RevealScreen
                  room={room}
                  options={currentRound.options}
                  players={players}
                  resolution={
                    resolution ||
                    VoteEvaluator.evaluateRound(
                      room.currentRoundIndex,
                      currentRound.options,
                      players
                    )
                  }
                  isHost={currentPlayer.isHost}
                  onAdvanceBeat={handleAdvanceRevealBeat}
                  onNextRound={handleNextRound}
                  onLeave={handleLeaveRoom}
                />
              )}

            {room.phase === "influence" && (
              <InfluenceScreen
                room={room}
                currentPlayer={currentPlayer}
                players={players}
                onSubmitInfluence={handleSubmitInfluence}
                onContinue={() => handleAdvanceRevealBeat("consequence")}
                onLeave={handleLeaveRoom}
              />
            )}

            {room.phase === "consequence" && (
              <ConsequenceScreen
                room={room}
                round={currentRound}
                winningOptionId={
                  resolution?.winningOptionId ||
                  VoteEvaluator.evaluateRound(
                    room.currentRoundIndex,
                    currentRound.options,
                    players
                  ).winningOptionId
                }
                liveConsequence={consequenceData}
                onProceedToBlame={() => handleAdvanceRevealBeat("blame")}
                onNextRound={handleNextRound}
                onLeave={handleLeaveRoom}
                onRemoveAdsClick={() => setShowConsequenceHostPass(true)}
              />
            )}

            {room.phase === "round_wrap" && (
              <ConsequenceScreen
                room={room}
                round={currentRound}
                winningOptionId={
                  resolution?.winningOptionId ||
                  VoteEvaluator.evaluateRound(
                    room.currentRoundIndex,
                    currentRound.options,
                    players
                  ).winningOptionId
                }
                liveConsequence={consequenceData}
                onProceedToBlame={() => handleAdvanceRevealBeat("blame")}
                onNextRound={handleNextRound}
                onLeave={handleLeaveRoom}
                onRemoveAdsClick={() => setShowConsequenceHostPass(true)}
              />
            )}

            {room.phase === "blame" && (
              <BlameScreen
                room={room}
                currentPlayer={currentPlayer}
                players={players}
                receipts={receipts}
                missionResults={missionResults}
                onSubmitBlame={handleSubmitBlame}
                onCompileReceipts={handleCompileReceipts}
                onNextRound={handleNextRound}
                onLeave={handleLeaveRoom}
              />
            )}
          </>
        )}

        {/* 7.5. HALFTIME BREAK (Midway through 8-10 round game) */}
        {view === "halftime" && room && (
          <HalftimeScreen
            room={room}
            isHost={Boolean(currentPlayer?.isHost)}
            onContinue={() => setView("gameplay")}
            onRemoveAdsClick={() => setShowConsequenceHostPass(true)}
          />
        )}

        {/* 8. CHAOS REPORT (End of Game) */}
        {view === "chaos_report" && currentPlayer && (
          <ChaosReportScreen
            report={
              chaosReport || {
                roomId: room?.id || "demo",
                totalPlayers: players.length || 6,
                totalDecisions: 18,
                totalMindChanges: 9,
                totalResourcesDestroyed: 30000 - (room?.resourceState.balance ?? 18000),
                mostInfluentialName: "Rohan",
                theWallName: "Aks",
                theSheepName: "Priya",
                mostBlamedName: "Rohan",
                playerTitles: {
                  [currentPlayer.id]: "THE MANIPULATOR",
                },
                scores: {},
              }
            }
            currentPlayerId={currentPlayer.id}
            isPaidSession={room?.isPaidSession}
            onRemoveAdsClick={() => setShowConsequenceHostPass(true)}
            onPlayAgain={() => {
              setHasSeenHalftime(false);
              setView("game_settings");
            }}
            onGoHome={() => {
              setHasSeenHalftime(false);
              setView("home");
            }}
          />
        )}

        {/* Ad Removal / Host Pass Modal for in-game consequence slot */}
        <HostPassModal
          isOpen={showConsequenceHostPass}
          roomCode={room?.roomCode}
          hostPlayerId={room?.hostId}
          onClose={() => setShowConsequenceHostPass(false)}
          onPassActivated={(product) => {
            if (product === "shared") {
              PlayerStorage.activatePass("shared_viral", 1);
            } else {
              PlayerStorage.activatePass(product.id, product.hostedGamesCount);
            }
            handleActivateHostPass();
          }}
        />
      </div>
    </div>
  );
}
