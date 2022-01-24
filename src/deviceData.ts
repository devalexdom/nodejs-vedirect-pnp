import deviceName from "./data/deviceName";

enum StatusMessage {
    "Off" = 0,
    "Low power" = 1,
    "Fault" = 2,
    "Bulk" = 3,
    "Absorption" = 4,
    "Float" = 5,
    "Storage" = 6,
    "Equalize (manual)" = 7,
    "Inverting" = 9,
    "Power supply" = 11,
    "Starting-up" = 245,
    "Repeated absorption" = 246,
    "Auto equalize / Recondition" = 247,
    "BatterySafe" = 247,
    "External Control" = 252
}

enum ErrorMessage {
    "" = 0,
    "Battery voltage too high" = 2,
    "Charger temperature too high" = 17,
    "Charger over current" = 18,
    "Charger current reversed" = 19,
    "Bulk time limit exceeded" = 20,
    "Current sensor issue (sensor bias/sensor broken)" = 21,
    "Terminals overheated" = 26,
    "Converter issue (dual converter models only)" = 28,
    "Input voltage too high (solar panel)" = 33,
    "Input current too high (solar panel)" = 34,
    "Input shutdown (due to excessive battery voltage)" = 38,
    "Input shutdown (due to current flow during off mode)" = 39,
    "Lost communication with one of devices" = 65,
    "Synchronised charging device configuration issue" = 66,
    "BMS connection lost" = 67,
    "Network misconfigured" = 68,
    "Factory calibration data lost" = 116,
    "Invalid/incompatible firmware" = 117,
    "User settings invalid" = 119

}


enum MPPTMessage {
    "Off" = 0,
    "Voltage or current limited" = 1,
    "MPP Tracker active" = 2,
}

enum OffReasonMessage {
    "" = 0,
    "No input power" = 1,
    "Switched off (power switch)" = 2,
    "Switched off (device mode register) " = 4,
    "Remote input" = 8,
    "Protection active" = 10,
    "Paygo" = 20,
    "BMS" = 40,
    "Engine shutdown detection" = 80,
    "Analysing input voltage" = 100,
}

export enum DeviceType {
    "MPPT" = 0,
    "Inverter" = 1,
    "BMV" = 2,
    "Charger" = 3
}

export class VEDirectPnP_UnsupportedDeviceData {
    deviceName: string;
    deviceSN: string;
    VEDirectData: Object;
    constructor(VEDirectData) {
        //VE.Direct -> UnsupportedDeviceData properties mapping
        this.deviceName = getDeviceName(VEDirectData["PID"]);
        this.deviceSN = VEDirectData["SER#"];
        this.VEDirectData = VEDirectData;
    }
}

export class VEDirectPnP_MPPTDeviceData {
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
    constructor(VEDirectData) {
        //VE.Direct -> MPPTDeviceData properties mapping
        this.deviceName = getDeviceName(VEDirectData["PID"]);
        this.deviceSN = VEDirectData["SER#"];
        this.deviceType = DeviceType[0];
        this.deviceFirmwareVersion = getDeviceFW(VEDirectData);
        this.batteryVoltage = VEDirectData["V"] / 1000; //mV -> V
        this.batteryCurrent = VEDirectData["I"] / 1000; //mA -> A
        this.statusMessage = StatusMessage[VEDirectData["CS"]];
        this.errorMessage = ErrorMessage[VEDirectData["ERR"]];
        this.mpptMessage = MPPTMessage[VEDirectData["MPPT"]];
        this.maximumPowerToday = VEDirectData["H21"]; // W
        this.maximumPowerYesterday = VEDirectData["H23"]; // W
        this.totalEnergyProduced = VEDirectData["H19"] / 100; // kWh
        this.energyProducedToday = VEDirectData["H20"] / 100; // kWh
        this.energyProducedYesterday = VEDirectData["H22"] / 100; // kWh
        this.photovoltaicPower = VEDirectData["PPV"]; // W
        this.photovoltaicVoltage = VEDirectData["VPV"] / 1000; //mV -> V
        this.photovoltaicCurrent = this.photovoltaicPower / this.photovoltaicVoltage; //A
        this.loadCurrent = VEDirectData["IL"] ? VEDirectData["IL"] / 1000 : 0; //mA -> A
        this.loadOutputState = getStringBoolean(VEDirectData["LOAD"]);
        this.relayState = getStringBoolean(VEDirectData["Relay"]);
        this.offReasonMessage = OffReasonMessage[VEDirectData["OR"]];
        this.daySequenceNumber = VEDirectData["HSDS"];
        this.VEDirectData = VEDirectData;
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