import deviceName from "./data/device-name";
import { StatusMessage, ErrorMessage, MPPTMessage, DeviceType, OffReasonMessage, AlarmReasonMessage } from "./data/device-data-enum";
import { VEDirectData } from "./ve-direct";

export interface VEDirectPnPDeviceData {
    deviceName: string;
    deviceType: string;
    deviceId: string;
    deviceSN?: string;
    deviceVEAdapterSN: string;
    VEDirectData: VEDirectData;
}

export class UnsupportedDeviceData implements VEDirectPnPDeviceData {
    deviceName: string;
    deviceType: string;
    deviceId: string;
    deviceSN: string;
    deviceVEAdapterSN: string;
    VEDirectData: VEDirectData;
    constructor(VEDirectRawData: VEDirectData, deviceId: string, deviceVEAdapterSN: string) {
        //VE.Direct -> UnsupportedDeviceData properties mapping
        const data = new VEDirectData(VEDirectRawData);
        this.deviceName = getDeviceName(data["PID"]);
        this.deviceId = deviceId;
        this.deviceSN = data["SER#"] ?? null;
        this.deviceVEAdapterSN = deviceVEAdapterSN;
        this.deviceType = "Unsupported";
        this.VEDirectData = data;
    }
}

export class BMVDeviceData implements VEDirectPnPDeviceData {
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
    constructor(VEDirectRawData: VEDirectData, deviceId: string, deviceVEAdapterSN: string) {
        //VE.Direct -> MPPTDeviceData properties mapping
        const data = new VEDirectData(VEDirectRawData);
        this.deviceName = getDeviceName(data["PID"]);
        this.deviceId = deviceId;
        this.deviceSN = data["SER#"] ?? null;
        this.deviceVEAdapterSN = deviceVEAdapterSN;
        this.deviceType = DeviceType[2];
        this.deviceFirmwareVersion = getDeviceFW(data);
        this.batteryMidPointVoltage = getNullableNumber(data.VM) / 1000; //mV -> V
        this.batteryMidPointDeviation = getNullableNumber(data.DM) / 10;
        this.batteryAuxVoltage = getNullableNumber(data.VS) / 1000; //mV -> V
        this.batteryVoltage = getNullableNumber(data.V) / 1000; //mV -> V
        this.batteryCurrent = getNullableNumber(data.I) / 1000; //mA -> A
        this.batteryPercentage = getNullableNumber(data.SOC) / 10;
        this.batteryInstantaneousPower = getNullableNumber(data.P) / 1000;
        this.batteryTemperature = getNullableNumber(data.T); //Celsius
        this.consumedAmpHours = getNullableNumber(data.CE) / 1000;
        this.relayState = getStringBoolean(data.Relay);
        this.deepestDischargeAmpHours = getNullableNumber(data.H1) / 1000;
        this.lastDischargeAmpHours = getNullableNumber(data.H2) / 1000;
        this.averageDischargeAmpHours = getNullableNumber(data.H3) / 1000;
        this.chargeCycles = getNullableNumber(data.H4);
        this.fullDischarges = getNullableNumber(data.H5);
        this.cumulativeDrawnAmpHours = getNullableNumber(data.H6) / 1000;
        this.batteryMinVoltage = getNullableNumber(data.H7) / 1000;
        this.batteryMaxVoltage = getNullableNumber(data.H8) / 1000;
        this.hoursSinceLastFullCharge = getNullableNumber(data.H9) / 3600;
        this.automaticSynchronizations = getNullableNumber(data.H10);
        this.lowMainVoltageAlarms = getNullableNumber(data.H11);
        this.highMainVoltageAlarms = getNullableNumber(data.H12);
        this.lowAuxVoltageAlarms = getNullableNumber(data.H13);
        this.highAuxVoltageAlarms = getNullableNumber(data.H14);
        this.batteryAuxMinVoltage = getNullableNumber(data.H15) / 1000;
        this.batteryAuxMaxVoltage = getNullableNumber(data.H16) / 1000;
        this.dischargedEnergy = getNullableNumber(data.H17) / 100; //KWh
        this.chargedEnergy = getNullableNumber(data.H18) / 100; //KWh
        this.alarmState = getStringBoolean(data.Alarm);
        this.alarmMessage = AlarmReasonMessage[data.AR];
        this.VEDirectData = data;
    }
}

export class MPPTDeviceData implements VEDirectPnPDeviceData {
    deviceType: string;
    deviceName: string;
    deviceId: string;
    deviceSN: string;
    deviceVEAdapterSN: string;
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
    constructor(VEDirectRawData: VEDirectData, deviceId: string, deviceVEAdapterSN: string) {
        //VE.Direct -> MPPTDeviceData properties mapping
        const data = new VEDirectData(VEDirectRawData);
        this.deviceName = getDeviceName(data["PID"]);
        this.deviceId = deviceId;
        this.deviceSN = data["SER#"];
        this.deviceVEAdapterSN = deviceVEAdapterSN;
        this.deviceType = DeviceType[0];
        this.deviceFirmwareVersion = getDeviceFW(data);
        this.batteryVoltage = data["V"] / 1000; //mV -> V
        this.batteryCurrent = data["I"] / 1000; //mA -> A
        this.statusMessage = StatusMessage[data["CS"]];
        this.errorMessage = ErrorMessage[data["ERR"]];
        this.mpptMessage = MPPTMessage[data["MPPT"]];
        this.maximumPowerToday = data["H21"]; // W
        this.maximumPowerYesterday = data["H23"]; // W
        this.totalEnergyProduced = data["H19"] / 100; // kWh
        this.energyProducedToday = data["H20"] / 100; // kWh
        this.energyProducedYesterday = data["H22"] / 100; // kWh
        this.photovoltaicPower = data["PPV"]; // W
        this.photovoltaicVoltage = data["VPV"] / 1000; //mV -> V
        this.photovoltaicCurrent = this.photovoltaicPower / this.photovoltaicVoltage; //A
        this.loadCurrent = data["IL"] ? data["IL"] / 1000 : 0; //mA -> A
        this.loadOutputState = getStringBoolean(data["LOAD"]);
        this.relayState = getStringBoolean(data["Relay"]);
        this.offReasonMessage = OffReasonMessage[data["OR"]];
        this.daySequenceNumber = data["HSDS"];
        this.VEDirectData = data;
    }
}

function getDeviceName(pid: number): string {
    if (deviceName[pid]) {
        return deviceName[pid];
    }
    return "Unknow Victron Device";
}

function getDeviceFW(VEDirectData: Object): number {
    const fw = VEDirectData["FW"] || VEDirectData["FWE"];
    return typeof fw === "number" ? fw / 100 : -1;
}

function getStringBoolean(stringBoolean: string): boolean {
    return stringBoolean === "ON" || stringBoolean === "On";
}
function getNullableNumber(nullableNumber?: number): number {
    return nullableNumber ?? 0;
}