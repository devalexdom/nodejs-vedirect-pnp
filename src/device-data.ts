import deviceName from "./data/device-name";
import { StatusMessage, ErrorMessage, MPPTMessage, DeviceType, OffReasonMessage } from "./data/device-data-enum";
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