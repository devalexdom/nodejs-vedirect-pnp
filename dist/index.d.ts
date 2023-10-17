import { VEDirectData } from "./ve-direct";
import SerialPort from "serialport";
import { IVEDirectPnP_DeviceData } from "./device-data";
interface IVEDirectPnP_Parameters {
    VEDirectDevicesPath?: string;
    customVEDirectDevicesPaths?: Array<string>;
}
interface IVEDirectPnP_EventData {
    message?: string;
    dataDump?: any;
    eventName?: string;
}
export default class VEDirectPnP {
    version: number;
    parameters: IVEDirectPnP_Parameters;
    currentEvent: string;
    listenersStack: Array<Function>;
    devicesVEDirectData: {
        [key: string]: Object;
    };
    serialPorts: Array<SerialPort>;
    fluidModeReady: boolean;
    constructor({ VEDirectDevicesPath, customVEDirectDevicesPaths }?: {
        VEDirectDevicesPath?: string;
        customVEDirectDevicesPaths?: any[];
    });
    on(event: string, callback: Function): void;
    emitEvent(event: string, eventData?: IVEDirectPnP_EventData): void;
    getVictronDeviceSN(VEDirectData: VEDirectData, VEDirectDevicePath: string, deviceIndex: number): string;
    mapVictronDeviceData(devicesData: {
        [key: string]: Object;
    }): {
        [key: string]: IVEDirectPnP_DeviceData;
    };
    init(): void;
    clean(): void;
    reset(): void;
    closeSerialPorts(): Promise<void>;
    destroy(callback?: Function): void;
    getDevicesData(): {
        [key: string]: IVEDirectPnP_DeviceData;
    };
    updateVEDirectDataDeviceData(VEDirectRawData: VEDirectData, devicePath: string, deviceIndex: number): void;
    getVEDirectDevicesAvailable(): Promise<string[]>;
    initVEDirectDataStreamFromAllDevices(): Promise<void>;
    initDataStreamFromVEDirect(devicePath: string, deviceIndex: number): Promise<void>;
}
export {};
