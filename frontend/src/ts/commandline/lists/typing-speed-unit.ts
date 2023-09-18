import { roundTo2 } from "../../utils/misc";

class Unit implements MonkeyTypes.TypingSpeedUnitSettings {
  unit: MonkeyTypes.TypingSpeedUnit;
  convertFactor: number;
  fullUnitString: string;
  histogramDataBucketSize: number;
  historyStepSize: number;

  constructor(
    unit: MonkeyTypes.TypingSpeedUnit,
    convertFactor: number,
    fullUnitString: string,
    histogramDataBucketSize: number,
    historyStepSize: number
  ) {
    this.unit = unit;
    this.convertFactor = convertFactor;
    this.fullUnitString = fullUnitString;
    this.histogramDataBucketSize = histogramDataBucketSize;
    this.historyStepSize = historyStepSize;
  }

  fromWpm(wpm: number): number {
    if (this.unit === "stt") {
      return this.convertFactor / wpm;
    } else {
      return wpm / this.convertFactor;
    }
  }

  toWpm(val: number): number {
    return val / this.convertFactor;
  }

  convertWithUnitSuffix(wpm: number): string {
    return roundTo2(this.fromWpm(wpm)).toFixed(2) + " " + this.unit;
  }
}

const typingSpeedUnits: Record<MonkeyTypes.TypingSpeedUnit, Unit> = {
  wpm: new Unit("wpm", 1, "Words per Minute", 10, 10),
  cpm: new Unit("cpm", 5, "Characters per Minute", 50, 100),
  wps: new Unit("wps", 1 / 60, "Words per Second", 0.5, 2),
  cps: new Unit("cps", 5 / 60, "Characters per Second", 5, 5),
  wph: new Unit("wph", 60, "Words per Hour", 250, 1000),
  stt: new (class extends Unit {
    constructor() {
      super("stt", 0, "Seconds to Type 100", 10, 10);
    }
    override fromWpm(wpm: number): number {
      return 6000 / wpm;
    }
    override toWpm(stt: number): number {
      return 6000 / stt;
    }
  })(),
};

export function get(
  unit: MonkeyTypes.TypingSpeedUnit
): MonkeyTypes.TypingSpeedUnitSettings {
  return typingSpeedUnits[unit];
}
