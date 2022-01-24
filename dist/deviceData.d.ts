export declare enum DeviceType {
    "MPPT" = 0,
    "Inverter" = 1,
    "BMV" = 2,
    "Charger" = 3
}
export declare class VEDirectPnP_UnsupportedDeviceData {
    deviceName: string;
    deviceSN: string;
    VEDirectData: Object;
    constructor(VEDirectData: any);
}
export declare class VEDirectPnP_MPPTDeviceData {
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
    VEDirectData: Object;
    constructor(VEDirectData: any);
}
