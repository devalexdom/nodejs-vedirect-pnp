import { VEDirectData } from "./ve-direct";
export interface VEDirectPnPDeviceData {
    deviceName: string;
    deviceType: string;
    deviceId: string;
    deviceSN?: string;
    deviceVEAdapterSN: string;
    VEDirectData: VEDirectData;
}
export declare class UnsupportedDeviceData implements VEDirectPnPDeviceData {
    deviceName: string;
    deviceType: string;
    deviceId: string;
    deviceSN: string;
    deviceVEAdapterSN: string;
    VEDirectData: VEDirectData;
    constructor(VEDirectRawData: VEDirectData, deviceId: string, deviceVEAdapterSN: string);
}
export declare class BMVDeviceData implements VEDirectPnPDeviceData {
    deviceType: string;
    deviceName: string;
    deviceId: string;
    deviceSN: string;
    deviceVEAdapterSN: string;
    deviceFirmwareVersion: number;
    batteryMinVoltage: number;
    batteryMaxVoltage: number;
    batteryVoltage: number;
    batteryAuxMinVoltage: number;
    batteryAuxMaxVoltage: number;
    batteryAuxVoltage: number;
    batteryMidPointVoltage: number;
    batteryMidPointDeviation: number;
    batteryCurrent: number;
    batteryChargingCurrent: number;
    batteryDischargingCurrent: number;
    batteryPercentage: number;
    batteryInstantaneousPower: number;
    batteryTemperature: number;
    consumedAmpHours: number;
    cumulativeDrawnAmpHours: number;
    deepestDischargeAmpHours: number;
    lastDischargeAmpHours: number;
    averageDischargeAmpHours: number;
    chargeCycles: number;
    fullDischarges: number;
    automaticSynchronizations: number;
    hoursSinceLastFullCharge: number;
    lowMainVoltageAlarms: number;
    highMainVoltageAlarms: number;
    lowAuxVoltageAlarms: number;
    highAuxVoltageAlarms: number;
    dischargedEnergy: number;
    chargedEnergy: number;
    relayState: boolean;
    alarmState: boolean;
    alarmMessage: string;
    VEDirectData: VEDirectData;
    constructor(VEDirectRawData: VEDirectData, deviceId: string, deviceVEAdapterSN: string);
}
export declare class MPPTDeviceData implements VEDirectPnPDeviceData {
    deviceType: string;
    deviceName: string;
    deviceId: string;
    deviceSN: string;
    deviceVEAdapterSN: string;
    deviceFirmwareVersion: number;
    batteryVoltage: number;
    batteryCurrent: number;
    batteryChargingPower: number;
    statusMessage: string;
    errorMessage: string;
    mpptMessage: string;
    maximumPowerToday: number;
    maximumPowerYesterday: number;
    totalEnergyProduced: number;
    energyProducedToday: number;
    energyProducedYesterday: number;
    photovoltaicPower: number;
    photovoltaicVoltage: number;
    photovoltaicCurrent: number;
    loadCurrent: number;
    loadOutputState: boolean;
    relayState: boolean;
    offReasonMessage: string;
    daySequenceNumber: number;
    VEDirectData: VEDirectData;
    constructor(VEDirectRawData: VEDirectData, deviceId: string, deviceVEAdapterSN: string);
}
