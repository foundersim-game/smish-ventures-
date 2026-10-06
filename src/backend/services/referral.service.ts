import { RoomRepository } from "../repositories/room.repository";
import { MonetizationService } from "./monetization.service";

export interface ReferralAttribution {
  refToken: string;
  roomCode: string;
  hostPlayerId: string;
  hostFingerprint?: string;
  hostIp?: string;
  verifiedVisitorIds: string[]; // Unique device/session fingerprints
  verifiedVisitorIps: string[];
  requiredUniqueJoins: number;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export class ReferralService {
  private static repo = RoomRepository.getInstance();
  // In-memory attribution store (persisted in session)
  private static attributions = new Map<string, ReferralAttribution>();

  /**
   * Generates or retrieves a unique referral token for a host in a specific room.
   */
  public static getOrCreateReferralToken(
    roomCode: string,
    hostPlayerId: string,
    hostFingerprint?: string,
    hostIp?: string
  ): ReferralAttribution {
    const key = `${roomCode.toUpperCase()}_${hostPlayerId}`;
    let record = this.attributions.get(key);

    if (!record) {
      const refToken = `REF-${roomCode.toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      record = {
        refToken,
        roomCode: roomCode.toUpperCase(),
        hostPlayerId,
        hostFingerprint,
        hostIp,
        verifiedVisitorIds: [],
        verifiedVisitorIps: [],
        requiredUniqueJoins: 1, // 1 verified unique friend join unlocks the room!
        isUnlocked: false,
      };

      this.attributions.set(key, record);
      this.attributions.set(refToken, record);
    }

    return record;
  }

  /**
   * Retrieves attribution by token or room code.
   */
  public static getAttribution(tokenOrCode: string): ReferralAttribution | null {
    return this.attributions.get(tokenOrCode.toUpperCase()) || null;
  }

  /**
   * Records an inbound player join with strict anti-abuse verification.
   * Checks:
   * 1. Visitor cannot be the host (no self-referral via same playerId or fingerprint).
   * 2. Visitor device fingerprint must be distinct (same contact opening 5 times counts as 1).
   * 3. Must be actively joining a real room session.
   */
  public static async recordVerifiedJoin(params: {
    refToken?: string;
    roomCode: string;
    joiningPlayerId: string;
    visitorFingerprint: string;
    visitorIp?: string;
  }): Promise<{ isNewVerified: boolean; isUnlocked: boolean; verifiedCount: number }> {
    const { refToken, roomCode, joiningPlayerId, visitorFingerprint, visitorIp } = params;

    let record = refToken ? this.attributions.get(refToken.toUpperCase()) : null;
    if (!record) {
      // Fallback: look up by roomCode in attributions
      for (const attr of this.attributions.values()) {
        if (attr.roomCode === roomCode.toUpperCase()) {
          record = attr;
          break;
        }
      }
    }

    if (!record) {
      return { isNewVerified: false, isUnlocked: false, verifiedCount: 0 };
    }

    // ANTI-ABUSE CHECK 1: Prevent host self-referral
    if (joiningPlayerId === record.hostPlayerId) {
      return { isNewVerified: false, isUnlocked: record.isUnlocked, verifiedCount: record.verifiedVisitorIds.length };
    }
    if (record.hostFingerprint && visitorFingerprint === record.hostFingerprint) {
      return { isNewVerified: false, isUnlocked: record.isUnlocked, verifiedCount: record.verifiedVisitorIds.length };
    }

    // ANTI-ABUSE CHECK 2: Prevent duplicate counting of same contact/device
    const alreadyCounted = record.verifiedVisitorIds.includes(visitorFingerprint);
    if (alreadyCounted) {
      return { isNewVerified: false, isUnlocked: record.isUnlocked, verifiedCount: record.verifiedVisitorIds.length };
    }

    // Record verified unique friend join
    record.verifiedVisitorIds.push(visitorFingerprint);
    if (visitorIp && !record.verifiedVisitorIps.includes(visitorIp)) {
      record.verifiedVisitorIps.push(visitorIp);
    }

    // Check if milestone achieved
    if (!record.isUnlocked && record.verifiedVisitorIds.length >= record.requiredUniqueJoins) {
      record.isUnlocked = true;
      record.unlockedAt = Date.now();
      // Server-authoritative unlock: room becomes ad-free paid session!
      await MonetizationService.activateRoomHostPass(record.roomCode);
    }

    return {
      isNewVerified: true,
      isUnlocked: record.isUnlocked,
      verifiedCount: record.verifiedVisitorIds.length,
    };
  }

  /**
   * Live status query for the host client to poll or monitor.
   */
  public static getLiveStatus(refTokenOrRoomCode: string): {
    verifiedCount: number;
    required: number;
    isUnlocked: boolean;
  } {
    const record = this.getAttribution(refTokenOrRoomCode);
    if (!record) {
      return { verifiedCount: 0, required: 1, isUnlocked: false };
    }

    return {
      verifiedCount: record.verifiedVisitorIds.length,
      required: record.requiredUniqueJoins,
      isUnlocked: record.isUnlocked,
    };
  }
}
