import deviceName from "./data/device-name";
import { StatusMessage, ErrorMessage, MPPTMessage, DeviceType, OffReasonMessage, AlarmReasonMessage, MonitorType } from "./data/device-data-enum";
import { VEDirectData } from "./ve-direct";

export interface IVEDirectPnP_DeviceData {
    deviceName: string;
    deviceSN: string;
    VEDirectData: VEDirectData;
}

export class VEDirectPnP_UnsupportedDeviceData implements IVEDirectPnP_DeviceData {
    deviceName: string;
    deviceSN: string;
    VEDirectData: VEDirectData;
    constructor(VEDirectRawData) {
        //VE.Direct -> UnsupportedDeviceData properties mapping
        const data = new VEDirectData(VEDirectRawData);
        this.deviceName = getDeviceName(data["PID"]);
        this.deviceSN = data["SER#"];
        this.VEDirectData = data;
    }
}

export class VEDirectPnP_MPPTDeviceData implements IVEDirectPnP_DeviceData {
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
    constructor(VEDirectRawData) {
        //VE.Direct -> MPPTDeviceData properties mapping
        const data = new VEDirectData(VEDirectRawData);
        this.deviceName = getDeviceName(data["PID"]);
        this.deviceSN = data["SER#"];
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

export class VEDirectPnP_SmartShuntDeviceData implements IVEDirectPnP_DeviceData {
    deviceType: string;
    deviceSN: string;
    deviceName: string;
    deviceFirmwareVersion: number;
    batteryVoltage: number;
    batteryMinimumVoltage: number;
    batteryMaximumVoltage: number;
    batteryCurrent: number;
    batteryCurrentDeepestDischarge: number;
    batteryCurrentLatestDischarge: number;
    batteryCurrentAverageDischarge: number;
    batteryPower: number;
    stateOfCharge: number;
    temperature: number;
    hoursPowerRemaining: any;
    hoursSinceFullCharge: number;
    monitorType: string;
    alarmState: boolean;
    alarmReason: string;
    batteryCycles: number;
    batteryFullCycles: number;
    batteryConsumedAmpHours: number;
    batteryCumulativeAmpHours: number;
    totalDischargeHours: number;
    totalChargeHours: number;
    batterySyncs: number;
    auxiliaryVoltage: number;
    auxiliaryMinimumVoltage: number;
    auxiliaryMaximumVoltage: number;
    batteryMidpointVoltage: number;
    batteryMidpointDeviation: number;
    alarmLowBatteryCount: number;
    alarmHighBatteryCount: number;
    alarmLowAuxiliaryCount: number;
    alarmHighAuxiliaryCount: number;
    VEDirectData: VEDirectData;
    constructor(VEDirectRawData, deviceSN: string) {
        //VE.Direct -> BMVDeviceData properties mapping
        const data = new VEDirectData(VEDirectRawData);
        this.deviceName = getDeviceName(data["PID"]);
        this.deviceSN = deviceSN;
        this.deviceType = DeviceType[2];
        this.deviceFirmwareVersion = getDeviceFW(data);
        this.batteryVoltage = data["V"] / 1000; //mV -> V
        this.batteryMinimumVoltage = data["H7"] / 1000; //mV -> V
        this.batteryMaximumVoltage = data["H8"] / 1000; //mV -> V
        this.batteryCurrent = data["I"] / 1000; //mA -> A
        this.batteryCurrentDeepestDischarge = data["H1"] / 1000; //mAh -> Ah
        this.batteryCurrentLatestDischarge = data["H2"] / 1000; //mAh -> Ah
        this.batteryCurrentAverageDischarge = data["H3"] / 1000; //mAh -> Ah
        this.batteryPower = data["P"]; //W
        this.stateOfCharge = data["SOC"] / 1000; //%
        this.monitorType = MonitorType[data["MON"]];
        this.temperature = data["T"]; //celsius
        this.hoursPowerRemaining = getRemainingTime(data["TTG"]); //minutes -> hours
        this.hoursSinceFullCharge = data["H9"] / 3600; //seconds -> hours
        this.alarmState = getStringBoolean(data["Alarm"]);
        this.alarmReason = AlarmReasonMessage[data["AR"]]
        this.batteryCycles = data["H4"];
        this.batteryFullCycles = data["H5"];
        this.batteryConsumedAmpHours = data["CE"] / 1000; //mAh -> Ah
        this.batteryCumulativeAmpHours = data["H6"] / 1000; //mAh -> Ah
        this.totalDischargeHours = data["H17"] / 100; //kWh
        this.totalChargeHours = data["H18"] / 100; //kWh
        this.batterySyncs = data["H10"];
        this.auxiliaryVoltage = data["VS"] / 1000; //mV -> V
        this.auxiliaryMinimumVoltage = data["H15"] / 1000; //mV -> V
        this.auxiliaryMaximumVoltage = data["H16"] / 1000; //mV -> V
        this.batteryMidpointVoltage = data["VM"] / 1000; //mV -> V
        this.batteryMidpointDeviation = data["DM"] / 1000; //%
        this.alarmLowBatteryCount = data["H11"];
        this.alarmHighBatteryCount = data["H12"];
        this.alarmLowAuxiliaryCount = data["H13"];
        this.alarmHighAuxiliaryCount = data["H14"];
        this.VEDirectData = data;
    }
}

function getDeviceName(pid: number): string {
    if (deviceName[pid]) {
        return deviceName[pid];
    }
    return "Unknown Victron Device";
}

function getDeviceFW(VEDirectData: Object): number {
    const fw = VEDirectData["FW"] || VEDirectData["FWE"];
    return typeof fw === "number" ? fw / 100 : -1;
}

function getStringBoolean(stringBoolean: string): boolean {
    return stringBoolean === "ON" || stringBoolean === "On";
}

function getRemainingTime(time: number):any {
    return time > 0 ? time / 60 : null;
}
