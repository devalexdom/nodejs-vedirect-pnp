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
