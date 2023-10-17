import { VEDirectData } from "./ve-direct";
export interface IVEDirectPnP_DeviceData {
    deviceName: string;
    deviceSN: string;
    VEDirectData: VEDirectData;
}
export declare class VEDirectPnP_UnsupportedDeviceData implements IVEDirectPnP_DeviceData {
    deviceName: string;
    deviceSN: string;
    VEDirectData: VEDirectData;
    constructor(VEDirectRawData: any);
}
export declare class VEDirectPnP_BMVDeviceData implements IVEDirectPnP_DeviceData {
    deviceType: string;
    deviceName: string;
    deviceSN: string;
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
    constructor(VEDirectRawData: any);
}
export declare class VEDirectPnP_MPPTDeviceData implements IVEDirectPnP_DeviceData {
    deviceType: string;
    deviceName: string;
    deviceSN: string;
    deviceFirmwareVersion: number;
    batteryVoltage: number;
    batteryCurrent: number;
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
    constructor(VEDirectRawData: any);
}
