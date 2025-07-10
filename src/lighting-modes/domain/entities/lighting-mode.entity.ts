export interface ColorConfig {
  mode: 'rgb' | 'temperature';
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  temperature: number;
}

export interface StateConfig {
  power: 'on' | 'off';
  brightness: number;
  color: ColorConfig;
}

export interface TransitionConfig {
  type: 'fade' | 'instant' | 'ease-in' | 'ease-out';
  duration: number; // Duration in seconds
}

export interface SequenceStep {
  duration: number; // Duration of this step in seconds
  state: StateConfig;
  transition: TransitionConfig;
}

export class LightingMode {
  constructor(
    public readonly id: string,
    public readonly userId: string | null, // null for system modes
    public readonly name: string,
    public readonly description: string,
    public readonly category: 'user' | 'system',
    public readonly habitatType: string,
    public readonly sequence: SequenceStep[],
    public readonly isShared: boolean,
    public readonly shareCode: string | null,
    public readonly originalModeId: string | null,
    public readonly originalAuthorId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    userId: string | null,
    name: string,
    description: string,
    category: 'user' | 'system',
    habitatType: string,
    sequence: SequenceStep[],
  ): LightingMode {
    return new LightingMode(
      '', // Will be set by repository
      userId,
      name,
      description,
      category,
      habitatType,
      sequence,
      false, // isShared default false
      null, // shareCode default null
      null, // originalModeId default null
      null, // originalAuthorId default null
      new Date(),
      new Date(),
    );
  }

  updateName(name: string): LightingMode {
    return new LightingMode(
      this.id,
      this.userId,
      name,
      this.description,
      this.category,
      this.habitatType,
      this.sequence,
      this.isShared,
      this.shareCode,
      this.originalModeId,
      this.originalAuthorId,
      this.createdAt,
      new Date(),
    );
  }

  updateDescription(description: string): LightingMode {
    return new LightingMode(
      this.id,
      this.userId,
      this.name,
      description,
      this.category,
      this.habitatType,
      this.sequence,
      this.isShared,
      this.shareCode,
      this.originalModeId,
      this.originalAuthorId,
      this.createdAt,
      new Date(),
    );
  }

  updateSequence(sequence: SequenceStep[]): LightingMode {
    return new LightingMode(
      this.id,
      this.userId,
      this.name,
      this.description,
      this.category,
      this.habitatType,
      sequence,
      this.isShared,
      this.shareCode,
      this.originalModeId,
      this.originalAuthorId,
      this.createdAt,
      new Date(),
    );
  }

  share(shareCode: string): LightingMode {
    return new LightingMode(
      this.id,
      this.userId,
      this.name,
      this.description,
      this.category,
      this.habitatType,
      this.sequence,
      true,
      shareCode,
      this.originalModeId,
      this.originalAuthorId,
      this.createdAt,
      new Date(),
    );
  }

  unshare(): LightingMode {
    return new LightingMode(
      this.id,
      this.userId,
      this.name,
      this.description,
      this.category,
      this.habitatType,
      this.sequence,
      false,
      null,
      this.originalModeId,
      this.originalAuthorId,
      this.createdAt,
      new Date(),
    );
  }

  createCopy(newUserId: string, originalModeId: string, originalAuthorId: string): LightingMode {
    return new LightingMode(
      '', // Will be set by repository
      newUserId,
      this.name,
      this.description,
      'user', // Copies are always user modes
      this.habitatType,
      this.sequence,
      false, // Copies start as not shared
      null, // No share code initially
      originalModeId,
      originalAuthorId,
      new Date(),
      new Date(),
    );
  }

  isSystemMode(): boolean {
    return this.category === 'system';
  }

  isUserMode(): boolean {
    return this.category === 'user';
  }

  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  getTotalDuration(): number {
    return this.sequence.reduce((total, step) => total + step.duration, 0);
  }
}
