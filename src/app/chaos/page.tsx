"use client";

import React, { useState, useEffect, useRef } from "react";
import { GameMode, GamePhase, GameSettings, RoomSession } from "@/core/types/room.types";
import { AvatarKey, PlayerSession } from "@/core/types/player.types";
import { ScenarioDefinition } from "@/core/types/scenario.types";
import { RoundVoteResolution } from "@/core/types/vote.types";
import { ChaosReportSummary } from "@/core/types/scoring.types";
import { ChaosModifier } from "@/core/types/chaos-events.types";
import { MissionEvaluationResult } from "@/core/types/mission.types";
import { ScenarioRegistry } from "@/backend/data/scenarios";
import { PlayerStorage } from "@/services/storage/player-storage";
import { ApiClient } from "@/services/network/api-client";
import { audio } from "@/services/audio/audio-manager";
import { haptics } from "@/services/haptics/haptics-manager";

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
import {
  LiveReactionOverlay,
  FloatingEmoji,
  BuzzerAlert,
} from "@/components/organisms/LiveReactionOverlay";
import { ReactionBuzzerType } from "@/core/types/events.types";
import { RoundReceiptsSummary } from "@/core/types/influence.types";

type ViewState =
  | "home"
  | "join"
  | "mode_select"
  | "scenario_select"
  | "game_settings"
  | "lobby"
  | "gameplay"
  | "chaos_report";

export default function ChaosMainApp() {
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
  } | null>(null);
  const [scoreBreakdowns, setScoreBreakdowns] = useState<
    Record<string, import("@/core/types/scoring.types").PlayerScoreBreakdown>
  >({});
  const [missionResults, setMissionResults] = useState<MissionEvaluationResult[]>([]);

  // Live Overlays & Events State
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [buzzerAlert, setBuzzerAlert] = useState<BuzzerAlert | null>(null);
  const [activeModifier, setActiveModifier] = useState<ChaosModifier | null>(null);
  const [joinToast, setJoinToast] = useState<string | null>(null);
  const [prefilledJoinCode, setPrefilledJoinCode] = useState("");

  const eventSourceRef = useRef<EventSource | null>(null);

  // Initialize profile & detect URL join query (?join=ABCD)
  useEffect(() => {
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

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("join");
      if (code) {
        setPrefilledJoinCode(code.toUpperCase());
        setView("join");
      }
    }
  }, []);

  // Realtime SSE Event Listener
  useEffect(() => {
    if (!room?.roomCode) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const sse = new EventSource(`/api/rooms/${room.roomCode}/events`);
    eventSourceRef.current = sse;

    sse.addEventListener("ROOM_UPDATED", (e) => {
      const data = JSON.parse(e.data);
      setRoom(data.room);
    });

    sse.addEventListener("PLAYERS_UPDATED", (e) => {
      const data = JSON.parse(e.data);
      setPlayers(data.players);
      if (currentPlayer) {
        const me = data.players.find((p: PlayerSession) => p.id === currentPlayer.id);
        if (me) setCurrentPlayer(me);
      }
    });

    sse.addEventListener("PLAYER_JOINED", (e) => {
      const data = JSON.parse(e.data);
      setJoinToast(`🎉 ${data.player.name} joined the party!`);
      audio.play("click");
      setTimeout(() => setJoinToast(null), 3000);
    });

    sse.addEventListener("PLAYER_LEFT", (e) => {
      const data = JSON.parse(e.data);
      setJoinToast(`👋 ${data.playerName} left the party.`);
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
      if (currentPlayer && data.playerId === currentPlayer.id) {
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

      if (data.buzzerType === "bullshit") audio.play("buzzer_bullshit");
      else if (data.buzzerType === "cap") audio.play("buzzer_cap");
      else audio.play("buzzer_anvil");

      haptics.trigger("heavy");
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
    });

    return () => {
      sse.close();
      eventSourceRef.current = null;
    };
  }, [room?.roomCode, currentPlayer?.id]);

  // Resilient multi-player room state synchronization (cross-serverless fallback)
  useEffect(() => {
    if (!room?.roomCode) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const fresh = await ApiClient.getRoom(room.roomCode);
        if (!isMounted) return;

        setPlayers((prev: PlayerSession[]) => {
          const prevStr = JSON.stringify(
            prev.map((p: PlayerSession) => ({
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
            fresh.players.map((p: PlayerSession) => ({
              id: p.id,
              ready: p.ready,
              connected: p.connected,
              v1: p.hasLockedInitialVote,
              v2: p.hasLockedFinalVote,
              name: p.name,
              score: p.stats.totalScore,
            }))
          );
          return prevStr !== freshStr ? fresh.players : prev;
        });

        setRoom((prev: RoomSession | null) => {
          if (!prev) return fresh.room;
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

        if (currentPlayer) {
          const freshMe = fresh.players.find((p: PlayerSession) => p.id === currentPlayer.id);
          if (freshMe) {
            setCurrentPlayer((prev: PlayerSession | null) => {
              if (!prev) return freshMe;
              if (
                prev.hasLockedInitialVote !== freshMe.hasLockedInitialVote ||
                prev.hasLockedFinalVote !== freshMe.hasLockedFinalVote ||
                prev.initialVoteOptionId !== freshMe.initialVoteOptionId ||
                prev.finalVoteOptionId !== freshMe.finalVoteOptionId ||
                JSON.stringify(prev.secretMission) !== JSON.stringify(freshMe.secretMission)
              ) {
                return freshMe;
              }
              return prev;
            });
          }
        }
      } catch {
        // Ignore background polling glitches
      }
    }, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [room?.roomCode, currentPlayer?.id, view]);

  // Dynamic Background Music (BGM) synchronization
  useEffect(() => {
    if (!room || view === "home" || view === "mode_select" || view === "scenario_select" || view === "game_settings") {
      audio.stopBGM();
      return;
    }

    if (room.phase === "discussion") {
      audio.playBGM("debate", 0.25);
    } else if (
      [
        "lobby",
        "initial_vote",
        "final_vote",
        "reveal",
        "influence",
        "consequence",
        "round_wrap",
        "blame",
        "chaos_report",
      ].includes(room.phase)
    ) {
      audio.playBGM("ambient", 0.2);
    }
  }, [room?.phase, view]);

  // Host creates room with their own saved profile
  const handleStartChaos = async (settings: GameSettings) => {
    try {
      const profile = PlayerStorage.getProfile();
      const res = await ApiClient.createRoom({
        hostName: profile.name,
        hostAvatar: profile.avatar,
        mode: selectedMode,
        scenarioId: selectedScenario.id,
        settings,
      });

      setRoom(res.room);
      setPlayers([res.host]);
      setCurrentPlayer(res.host);
      setView("lobby");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create game");
    }
  };

  // Real player joins via room code
  const handleJoinRoom = async (code: string, name: string, avatar: AvatarKey) => {
    const res = await ApiClient.joinRoom(code, name, avatar);
    setRoom(res.room);
    setCurrentPlayer(res.player);
    const updated = await ApiClient.getRoom(code);
    setPlayers(updated.players);
    if (updated.scenario) {
      setSelectedScenario(updated.scenario);
    }
    setView("lobby");
  };

  // Host adds an AI / Demo bot player to the lobby
  const handleAddBot = async () => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.addBotPlayer(room.roomCode, currentPlayer.id);
      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
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
  const handleStartGameFromLobby = async () => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "START_GAME");
      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
      const me = updated.players.find((p) => p.id === currentPlayer.id);
      if (me) setCurrentPlayer(me);
      if (updated.scenario) {
        setSelectedScenario(updated.scenario);
      }
      setView("gameplay");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to start");
    }
  };

  // Player locks initial vote
  const handleLockInitialVote = async (optionId: string) => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "LOCK_INITIAL_VOTE", {
        optionId,
      });

      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
      const me = updated.players.find((p) => p.id === currentPlayer.id);
      if (me) setCurrentPlayer(me);

      // If playing with bots/squad, simulate remaining bots locking votes with natural pacing
      setTimeout(async () => {
        try {
          const fresh = await ApiClient.getRoom(room.roomCode);
          for (const p of fresh.players) {
            if (p.id !== currentPlayer.id && !p.hasLockedInitialVote) {
              const options = ["A", "B", "C", "D"];
              const opt = options[Math.floor(Math.random() * options.length)];
              await ApiClient.sendAction(room.roomCode, p.id, "LOCK_INITIAL_VOTE", {
                optionId: opt,
              });
            }
          }
          const allLocked = await ApiClient.getRoom(room.roomCode);
          setRoom(allLocked.room);
          setPlayers(allLocked.players);
          const freshMe = allLocked.players.find((p) => p.id === currentPlayer.id);
          if (freshMe) setCurrentPlayer(freshMe);
        } catch (e) {
          console.error("Error locking bot votes:", e);
        }
      }, 1200);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Discussion time expires
  const handleDiscussionTimeUp = async () => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "SKIP_DISCUSSION");
      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Player locks final vote
  const handleLockFinalVote = async (optionId: string) => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "LOCK_FINAL_VOTE", {
        optionId,
      });

      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
      setPlayers(updated.players);
      const me = updated.players.find((p) => p.id === currentPlayer.id);
      if (me) setCurrentPlayer(me);

      // Simulate bot final votes if any
      setTimeout(async () => {
        try {
          const fresh = await ApiClient.getRoom(room.roomCode);
          for (const p of fresh.players) {
            if (p.id !== currentPlayer.id && !p.hasLockedFinalVote) {
              const flipOpt =
                p.name === "Riya" || p.name === "Karan"
                  ? "B"
                  : p.initialVoteOptionId || "B";
              await ApiClient.sendAction(room.roomCode, p.id, "LOCK_FINAL_VOTE", {
                optionId: flipOpt,
              });
            }
          }
          const allLocked = await ApiClient.getRoom(room.roomCode);
          setRoom(allLocked.room);
          setPlayers(allLocked.players);
          const freshMe = allLocked.players.find((p) => p.id === currentPlayer.id);
          if (freshMe) setCurrentPlayer(freshMe);
        } catch (e) {
          console.error("Error locking bot final votes:", e);
        }
      }, 1200);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Advance reveal beat
  const handleAdvanceRevealBeat = async (targetBeat: GamePhase) => {
    if (!room || !currentPlayer) return;
    try {
      await ApiClient.sendAction(room.roomCode, currentPlayer.id, "ADVANCE_REVEAL_BEAT", {
        targetBeat,
      });
      const updated = await ApiClient.getRoom(room.roomCode);
      setRoom(updated.room);
    } catch (err: unknown) {
      console.error(err);
    }
  };

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
          }).catch(() => {});
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
          }).catch(() => {});
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

  const handleLeaveRoom = () => {
    setRoom(null);
    setView("home");
  };

  const currentRound =
    selectedScenario.rounds[(room?.currentRoundIndex || 1) - 1] || selectedScenario.rounds[0];

  return (
    <div className="relative min-h-screen w-full bg-[#06010D] flex items-center justify-center overflow-x-hidden">
      {/* Studio Ambient Backlights for Desktop */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Game Screen Canvas */}
      <div className="relative min-h-screen w-full max-w-[420px] bg-[#080210] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(168,85,247,0.2)] flex flex-col justify-between overflow-x-hidden">
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
            onBack={() => setView("scenario_select")}
            onStartChaos={handleStartChaos}
          />
        )}

        {/* 6. LOBBY SCREEN (Screen 7) */}
        {view === "lobby" && room && currentPlayer && (
          <LobbyScreen
            room={room}
            players={players}
            currentPlayerId={currentPlayer.id}
            onStartGame={handleStartGameFromLobby}
            onLeaveRoom={handleLeaveRoom}
            onEditSettings={() => setView("game_settings")}
            onAddBot={handleAddBot}
            onKickPlayer={handleKickPlayer}
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
                  resolution || {
                    roundIndex: room.currentRoundIndex,
                    totalVotes: 6,
                    winningOptionId: "B",
                    winningOptionLabel: "Go clubbing",
                    voteTally: {
                      A: { optionId: "A", voteCount: 1, percentage: 17, voterPlayerIds: [] },
                      B: { optionId: "B", voteCount: 4, percentage: 66, voterPlayerIds: [] },
                      C: { optionId: "C", voteCount: 0, percentage: 0, voterPlayerIds: [] },
                      D: { optionId: "D", voteCount: 1, percentage: 17, voterPlayerIds: [] },
                    },
                    mindChanges: [
                      {
                        playerId: "2",
                        playerName: "Riya",
                        avatar: "fire",
                        initialOptionId: "A",
                        finalOptionId: "B",
                      },
                      {
                        playerId: "3",
                        playerName: "Karan",
                        avatar: "sunglasses",
                        initialOptionId: "C",
                        finalOptionId: "B",
                      },
                      {
                        playerId: "6",
                        playerName: "Neha",
                        avatar: "skull",
                        initialOptionId: "D",
                        finalOptionId: "B",
                      },
                    ],
                    keptVotePlayerIds: ["1", "4", "5"],
                    switchedPlayerCount: 3,
                    keptPlayerCount: 3,
                  }
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
                winningOptionId={resolution?.winningOptionId || "B"}
                liveConsequence={consequenceData}
                onProceedToBlame={() => handleAdvanceRevealBeat("blame")}
                onNextRound={handleNextRound}
                onLeave={handleLeaveRoom}
              />
            )}

            {room.phase === "round_wrap" && (
              <ConsequenceScreen
                room={room}
                round={currentRound}
                winningOptionId={resolution?.winningOptionId || "B"}
                liveConsequence={consequenceData}
                onProceedToBlame={() => handleAdvanceRevealBeat("blame")}
                onNextRound={handleNextRound}
                onLeave={handleLeaveRoom}
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
            onPlayAgain={() => setView("game_settings")}
            onGoHome={() => setView("home")}
          />
        )}
      </div>
    </div>
  );
}
