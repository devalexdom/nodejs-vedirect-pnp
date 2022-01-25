import SerialPort from "serialport";
import { IVEDirectPnP_DeviceData } from "./device-data";
interface IVEDirectPnP_Parameters {
    VEDirectDevicesPath?: string;
    customVEDirectDevicesPaths?: Array<string>;
}
interface IVEDirectPnP_EventData {
    message?: String;
    dataDump?: any;
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
    getVictronDeviceSN(VEDirectData: Object): any;
    mapVictronDeviceData(devicesData: {
        [key: string]: Object;
    }): {
        [key: string]: IVEDirectPnP_DeviceData;
    };
    init(): void;
    stop(): void;
    getDevicesData(): {
        [key: string]: IVEDirectPnP_DeviceData;
    };
    updateVEDirectDataDeviceData(VEDirectRawData: any): void;
    getVEDirectDevicesAvailable(): Promise<string[]>;
    initVEDirectDataFlowFromAllDevices(): Promise<void>;
    initDataFlowFromVEDirect(devicePath: any): Promise<void>;
}
export {};
